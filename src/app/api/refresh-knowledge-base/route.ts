import { NextResponse } from "next/server";
import Exa from "exa-js";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { string } from "zod";

const gemini_api_key = process.env.NEXT_PUBLIC_GEMINI_GENAI_API_KEY;
const exa_api_key = process.env.NEXT_PUBLIC_EXA_API_KEY;
const pinecone_api_key = process.env.NEXT_PUBLIC_PINECONE_API_KEY;
const pinecone_index = process.env.NEXT_PUBLIC_PINECONE_INDEX;



export async function POST() {


    const ai = new GoogleGenAI({ apiKey: gemini_api_key });
    const pinecone = new Pinecone({ apiKey: pinecone_api_key! });
    const Index = pinecone.index(pinecone_index!);
    const exa = new Exa(exa_api_key);


  try {
    const result = await exa.getContents([
      "https://www.aven.com/support"
    ], {
      text: true
    });
    const text = result.results?.[0]?.text;



    // 1. Match all sections with their headings
    const sectionRegex = /(##### .+?)(?=^##### |\Z)/gms;
    const matches = text.match(sectionRegex) || [];

    // 2. For each chunk, embed and upsert
    for (let i = 0; i < matches.length; i++) {
      const chunkText = matches[i];
      const embeddingRes = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: chunkText,
        config: { taskType: "SEMANTIC_SIMILARITY" }
      });
      if (!embeddingRes.embeddings) continue;
      const values = embeddingRes.embeddings[0].values as unknown as number[];
      await Index.upsert([{
        id: "record" + i,
        values,
        metadata: { text: chunkText }
      }]);
    }

    return NextResponse.json({
      success: true,
      data: {
        chunkCount: matches.length,
        exaResult: matches.length
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 