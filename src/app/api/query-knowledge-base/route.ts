import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const gemini_api_key = process.env.GEMINI_GENAI_API_KEY;
const pinecone_api_key = process.env.NEXT_PUBLIC_PINECONE_API_KEY;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: "No query provided." }, { status: 400 });
    }

    // 1. Embed the query
    const ai = new GoogleGenAI({ apiKey: gemini_api_key });
    const embedRes = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: query,
      config: { taskType: "SEMANTIC_SIMILARITY" }
    });
    if (!embedRes.embeddings) {
      return NextResponse.json({ success: false, error: "Failed to embed query." }, { status: 500 });
    }
    const queryEmbedding = embedRes.embeddings[0].values as unknown as number[];

    // 2. Query Pinecone for the most relevant chunk
    const pinecone = new Pinecone({ apiKey: pinecone_api_key! });
    const index = pinecone.index("aven");
    const queryResult = await index.query({
      topK: 1,
      vector: queryEmbedding,
      includeMetadata: true
    });
    
    const match = queryResult.matches?.[0];
    const context = match?.metadata?.text || "";
    const similarityScore = match?.score || 0;

    // 3. Determine if we have relevant context (similarity threshold)
    const SIMILARITY_THRESHOLD = 0.5;
    const hasRelevantContext = context && similarityScore > SIMILARITY_THRESHOLD;

    let answer: string = "";
    let source: "knowledge_base" | "gemini_flash" = "knowledge_base";

    if (hasRelevantContext) {
      // Use context-based response
      const prompt = `
      You are an intelligent assistant tasked with answering questions strictly using the context provided below. You must not use any external knowledge or make assumptions beyond the given context.
      
      ---
      
      **User Query:**
      ${query}
      
      **Retrieved Context:**
      ${context}
      
      ---
      
      **Instructions:**
      
      - Provide a clear, concise, and factual answer **based only on the context**.
      - **Do not** include explanations about the context itself.
      - If the context does **not contain relevant information** to answer the query, respond with:
        > "The provided context does not contain enough information to answer this question."
      
      - If the query is **ambiguous** or **requires clarification**, respond with:
        > "The query is unclear or incomplete based on the provided context."
      
      Begin your answer below:
      `;
      
      const genRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      answer = genRes?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";
      source = "knowledge_base";
      
      // Check if the context-based response indicates irrelevant context
      const irrelevantContextIndicators = [
        "The provided context does not contain enough information to answer this question.",
        "The query is unclear or incomplete based on the provided context.",
        "I cannot answer this question based on the provided context.",
        "The context does not contain relevant information",
        "not enough information",
        "cannot answer"
      ];
      
      const isContextIrrelevant = irrelevantContextIndicators.some(indicator => 
        answer.toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (isContextIrrelevant) {
        // Fall back to general knowledge response
        const generalPrompt = `
        You are a helpful AI assistant for Aven, a financial services company. The user has asked a question that isn't covered in our specific knowledge base, so please provide a helpful and informative response using your general knowledge. Refer this website : https://www.aven.com/
        
        **User Query:** ${query}
        
        **Instructions:**
        - Provide a helpful, accurate, and informative response
        - If the question is related to financial services, home equity, or similar topics, provide relevant information
        - Be conversational and friendly
        - If you're not sure about something, acknowledge the limitations
        - Keep responses concise but informative
        - Always encourage users to verify information with official sources or contact Aven directly
        - End your response with a note to verify with official sources
        
        Please respond:
        `;
        
        const genRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: generalPrompt }] }],
        });
        answer = genRes?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't provide a helpful response at the moment.";
        source = "gemini_flash";
      }
    } else {
      // No relevant context found, use general knowledge
      const generalPrompt = `
      You are a helpful AI assistant for Aven Insights, a financial services company. The user has asked a question that isn't covered in our specific knowledge base, so please provide a helpful and informative response using your general knowledge.
      
      **User Query:** ${query}
      
      **Instructions:**
      - Provide a helpful, accurate, and informative response
      - If the question is related to financial services, home equity, or similar topics, provide relevant information
      - Be conversational and friendly
      - If you're not sure about something, acknowledge the limitations
      - Keep responses concise but informative
      
      Please respond:
      `;
      
      const genRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: generalPrompt }] }],
      });
      answer = genRes?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't provide a helpful response at the moment.";
      source = "gemini_flash";
    }

    return NextResponse.json({ 
      success: true, 
      answer, 
      context: hasRelevantContext ? context : null,
      source,
      similarityScore: hasRelevantContext ? similarityScore : null
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 