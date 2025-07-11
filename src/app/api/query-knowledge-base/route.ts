import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const gemini_api_key = process.env.NEXT_PUBLIC_GEMINI_GENAI_API_KEY;
const pinecone_api_key = process.env.NEXT_PUBLIC_PINECONE_API_KEY;
const pinecone_index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

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
    const index = pinecone.index(pinecone_index!);
    const queryResult = await index.query({
      topK: 1,
      vector: queryEmbedding,
      includeMetadata: true
    });
    const context = queryResult.matches?.[0]?.metadata?.text || "";

    // 3. Use Gemini to generate a response based on the context
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
      // Remove generationConfig if not supported
    });
    const answer = genRes?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";

    return NextResponse.json({ success: true, answer, context });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 