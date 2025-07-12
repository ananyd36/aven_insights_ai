
import Exa from "exa-js";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { string } from "zod";



const gemini_api_key = process.env.NEXT_PUBLIC_GEMINI_GENAI_API_KEY;
const exa_api_key = process.env.EXA_API_KEY;
const pinecone_api_key = process.env.PINECONE_API_KEY;
const pinecone_index = process.env.PINECONE_INDEX;


const ai = new GoogleGenAI({ apiKey: "AIzaSyC9RcGRQ_Myk544etFx7qAwerhNH9sh7vY" });
const exa = new Exa("e37b5f50-2f87-4a23-a3a4-31c84eeafaac");

// const embeddingRes = await ai.models.embedContent({
// 	model: 'text-embedding-004',
// 	contents: "Hello World, this is an nextjs app",
// 	config: { taskType: "SEMANTIC_SIMILARITY" }
//   });

//   console.log(embeddingRes.embeddings[0]);

//   const text = `Schedule A Callback

// ##### Trending Articles

// - Is the rate variable? ![down](https://www.aven.com/img/down.bb266b57.svg)
// The Aven Card is a variable rate credit card. Cash outs may have a fixed rate option. See your offer for details. The variable rate varies based on an Index (Prime Rate published in the Wall Street Journal or the Federal Funds Target Rate Upper Limit set by the Federal Reserve). This is outside Aven's control. As the Index shifts up or down, so will the APR on the Aven Card and any other variable-rate credit cards, lines, and loans. The Index may change several times a year or go for many months without change.

// - How does Aven determine the credit line size and interest rate? ![down](https://www.aven.com/img/down.bb266b57.svg)
// Aven's bank-standard underwriting system is fully automated, and calculates offers based on an applicant's income, equity, credit, and debt obligations.

// - Does Aven offer a fixed rate? ![down](https://www.aven.com/img/down.bb266b57.svg)
// Some Aven cardholders may be able to create fixed payment, fixed rate Simple Loan plans. Applicants can check their details in their account agreement.

// - Is Aven a credit card or a home equity line of credit? ![down](https://www.aven.com/img/down.bb266b57.svg)
// It is both! Aven is a home equity line of credit that customers access through a credit card. Aven cardholders can use their Aven Card wherever VISA cards are accepted.

// Aven cardholders can transfer cash directly from their Aven account to another bank account – it is called a CashOut. There may be a one time fee (please see your account agreement) of the total amount being transferred that will be added to the balance.

// To transfer balance from a high interest credit card to the Aven card, cardholders can request a balance transfer (BT) to their credit card. There may be a one time fee (please see your account agreement) of the total amount being transferred that will be added to the balance.


// ##### Payments

// - How are payments calculated for fixed installment plans? ![down](https://www.aven.com/img/down.bb266b57.svg)
// Aven offers fixed payment plans that amortize over several years, details being in the account agreement. The payment is calculated so that the entire amount of the plan and the interest is paid off by the end of the selected term. For payment estimates, please visit [https://www.aven.com/paymentcalculator](https://www.aven.com/paymentcalculator";`
  



// const sectionRegex = /(##### .+?)(?=^##### |\Z)/gms;
//   const matches = text.match(sectionRegex) || [];
//   const embeddingRes = await ai.models.embedContent({
// 	model: 'text-embedding-004',
// 	contents: text,
// 	config: { taskType: "SEMANTIC_SIMILARITY" }
//   });
//   console.log(embeddingRes.embeddings[0].values);

// const result = await exa.getContents([
//     "https://www.aven.com",
//   ], {
//     text: true
//   });
// const text = result.results?.[0]?.text;
// console.log("------------------------------------------");
// console.log(text);