import { NextResponse } from "next/server";
import Exa from "exa-js";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";

const gemini_api_key = process.env.GEMINI_GENAI_API_KEY;
const exa_api_key = process.env.EXA_API_KEY;
const pinecone_api_key = process.env.PINECONE_API_KEY;


export async function POST() {


    const ai = new GoogleGenAI({ apiKey: gemini_api_key as string });
    const pinecone = new Pinecone({ apiKey: pinecone_api_key as string });
    const Index = pinecone.index("aven");
    const exa = new Exa(exa_api_key as string );


  try {
    // Categorized sites with specific processing rules
    const categorizedSites = [
      {
        url: "https://www.aven.com/support",
        category: "support",
        regex: /(?:^|\n\n)- .+?(?=(\n\n- |\n*$))/gs, // FAQ entries
        description: "Support FAQ content"
      },
      {
        url: "https://www.aven.com/education",
        category: "education",
        regex: /(### .+?)(?=^### |\Z)/gms, // Education sections
        description: "Educational content"
      },
      {
        url: "https://en.wikipedia.org/wiki/Home_equity_line_of_credit",
        category: "external_knowledge",
        regex: /(## .+?)(?=^## |\Z)/gs, // Wikipedia sections
        description: "External knowledge base"
      }
    ];

    let totalChunks = 0;
    const processedSites = [];

    // Clear all existing embeddings before refreshing
    console.log("Clearing existing embeddings from index...");
    await Index.deleteAll();
    console.log("Index cleared successfully");

    // Process each site based on its category
    for (const site of categorizedSites) {
      try {
        console.log(`Processing ${site.category} site: ${site.url}`);
        
        // Scrape single site
        const result = await exa.getContents([site.url], { text: true });
        const text = result.results?.[0]?.text;
        
        if (!text) {
          console.log(`No text found for: ${site.url}`);
          continue;
        }

        // Use category-specific regex pattern
        const matches = text.match(site.regex) || [];
        console.log(`Found ${matches.length} sections in ${site.category} site`);

        // Process chunks based on category
        for (let i = 0; i < matches.length; i++) {
          const chunkText = matches[i];
          
          // Category-specific processing
          let processedText = chunkText;
          if (site.category === "external_knowledge") {
            // Clean Wikipedia formatting
            processedText = chunkText.replace(/==/g, '').replace(/\[\[|\]\]/g, '');
          } else if (site.category === "support") {
            // Keep FAQ format as is
            processedText = chunkText;
          }

          const embeddingRes = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: processedText,
            config: { taskType: "SEMANTIC_SIMILARITY" }
          });
          if (!embeddingRes.embeddings) continue;
          const values = embeddingRes.embeddings[0].values as unknown as number[];
          await Index.upsert([{
            id: `${site.category}_${site.url.replace(/[^a-zA-Z0-9]/g, '_')}_${i}`,
            values,
            metadata: { 
              text: processedText, 
              source: site.url, 
              category: site.category,
              description: site.description
            }
          }]);
          totalChunks++;
        }

        processedSites.push({ 
          url: site.url, 
          category: site.category, 
          chunks: matches.length,
          description: site.description
        });
        console.log(`Completed processing ${site.category} site with ${matches.length} chunks`);
        
      } catch (siteError) {
        console.error(`Error processing ${site.url}:`, siteError);
        processedSites.push({ 
          url: site.url, 
          category: site.category, 
          error: (siteError as Error).message 
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalChunks,
        processedSites,
        totalSites: categorizedSites.length
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 