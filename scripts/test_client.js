
import 'dotenv/config'
import Exa from "exa-js";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";

// const gemini_api_key = process.env.GEMINI_GENAI_API_KEY;
// const exa_api_key = process.env.EXA_API_KEY;
// const pinecone_api_key = process.env.PINECONE_API_KEY;

const ai = new GoogleGenAI({ apiKey: "AIzaSyC9RcGRQ_Myk544etFx7qAwerhNH9sh7vY" });
const pinecone = new Pinecone({ apiKey: "pcsk_6Ww3bB_H9QCLUyDsycxtYboyfQomsgWjdTXxqsKobEmHZBhSXALRnz2Heo9dohBPx3UcAq" });
const index = pinecone.index("aven");

const text  =  `© 2025 Aven

The annual percentage rate (“APR”) is the cost of credit as a yearly rate and does not include costs other than interest. The APR is a variable rate based on the Wall Street Journal prime rate (“Index”) published by the Wall Street Journal in its Money Rates section. The WSJ Prime Rate as of Jan 10th, 2025 EST is 7.50%. Your initial APR is based on a margin, determined by your creditworthiness when you open your account, plus the Index at the time of application. Your APR is subject to change as allowed by applicable law. Best rates available only to the highest-qualified borrowers. The maximum APR will not exceed 18% during the life of your account. Cash Out (draw to bank account) fee and Balance Transfer fee is 2.5% of amount transferred. This fee is subject to change. The county where your property is located may charge recording fees. If your line is greater than $25,000, you are responsible for paying these costs. These costs will be placed in a 12-month interest free, fixed term loan and be part of your Minimum Payment Due.

You are not required to sign up for AutoPay. To receive a 0.25 percentage point discount to your APR, you must enroll in AutoPay by the end of your first billing cycle and maintain AutoPay. This discount is available to new cardholders only. If you fail to enroll, or if you discontinue AutoPay, your APR will increase by 0.25 percentage points. We reserve the right to terminate or modify the AutoPay discount program at any time without notice. See AutoPay Terms & Conditions for details.

Cash back available for those who sign up for AutoPay. See Cash Back Terms & Conditions for details. Some restrictions apply.

For the initial cash out draw, you are charged a fee of 0% of the amount drawn. This fee is subject to change. There are no fees for subsequent cash outs or balance transfers. The APR for an Aven Simple Loan (the “ASL APR”) is based on your variable APR and other factors at the time you agree to the plan. The ASL APR is fixed and will not change during the term of this plan and is subject to the applicable draw supplement.

If you have an active HELOC agreement or offer within the last 30 days that demonstrates a lower cost than ours, we’ll beat the offer or send you $250. Introductory, temporary, and promotional offers do not apply toward our guarantee. Only valid for new customers who received this specific offer. We reserve the right to change the terms of the guarantee at any time. Guarantee Terms and Conditions.

If you have an existing second lien (“Second Lien”) on your subject property, you acknowledge and agree that we may transfer your application to our refinance product (subject in all cases to credit approval). The refinance product may have different terms and conditions than the initial product you applied for. Please review the Early HELOC Disclosure for more information.

Our APR is 7.49-14.99% for primary residences. The average for other cards in the US for people with good credit is over 24% APR. Source: "Average Credit Card Interest Rates" wallethub.com on Jan 15, 2024 showing the average rate for credit cards in the US for people with good credit is 24.10% APR.

These comparison charts use the midpoint of each card's APR range. Aven’s midpoint as of Jul 13, 2025 is 11.24%. Sources: Capital One Platinum, Chase Freedom, Bank of America Cash Rewards Card.

Source: "Home Equity Loan Rates". Source: "How Long Do I Need to Wait for a Home Equity Line?". Source: "Average Credit Card Limit". Source: "What’s a Good Personal Loan Interest Rate?". Source: "Personal Loan Statistics". Source: "Credit Card Fee Study: What's Normal and What's Not?". Source: "What to know about personal loan origination fees".

Our fixed monthly payment option (Aven Simple Loan) is available based on your Var APR plus fees not exceeding the High Cost Mortgage threshold set by law. Your rate will not increase while the Aven Simple Loan plan is open.

Amount of 'Interest Saved' is calculated as follows:

For revolving plans – (1) for each month, we determine interest savings by multiplying (a) our current revolving balances by (b) our balance-weighted average APR minus the average interest rate on credit card plans and (c) then dividing by 12; (2) we then sum up the interest savings over all months since the company’s launch. The source of the average interest rate on credit card plans comes from FRED.

For fixed rate plans – (1) for each month, we determine the interest savings by multiplying (a) our current fixed rate balances by (b) our balance-weighted average APR minus the average interest rate for 5 year fixed personal loans and (c) then dividing by 12; (2) we then sum up the interest savings over all months since the company’s launch. The source of the average interest rate on personal loans comes from Credible

We then sum up the cumulative savings for both revolving and fixed rate plans.

Subject to Credit Approval, including use of data reports from Experian, Equifax and Transunion. Limit of one Account per property. Certain terms and conditions may apply. Terms may vary by applicant and are subject to change. Availability limited to certain states. See aven.com/licenses for more details. Not available for multi-unit homes. Requires a lien on your property. Flood insurance may be required if your property is located in a flood zone. Not available for home purchase. If you have an existing second lien (“Second Lien”) on your subject property, you acknowledge and agree that we may transfer your application to our refinance product (subject in all cases to credit approval). The refinance product may have different terms and conditions than the initial product you applied for. Please review the Early HELOC Disclosure for more information.

Note for customers in AK, ID, LA, NM, OK, SD, WY: We currently only offer lines up to $100,000. Check back soon for higher line sizes.

Notice to Consumers about all Languages. Para Español, consulte este documento.

Aven cards are arranged by Aven Financial, Inc., dba "Aven" or "AvenCard" (in AR, ID, and PA). NMLS #2042345. See aven.com/licenses for state specific details. Aven reserves the right to modify or discontinue its products or offerings at any time without notice.

Aven Visa Credit Cards are issued by Coastal Community Bank, pursuant to a license from Visa U.S.A., Inc. Aven accounts are made by Coastal Community Bank, Member FDIC. Equal Housing Lender. NMLS #462289 (NMLS Consumer Access Page). For additional information or complaints to Coastal Community Bank, visit www.federalreserveconsumerhelp.gov. For more information, you can also visit Coastal Community Bank’s privacy policy.

For licensing information, go to www.nmlsconsumeraccess.org

Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc., registered in the U.S. and other countries. Google Play and the Google Play logo are trademarks of Google Inc.`;

(async () => {
  // 1. Create the embedding
  const embeddingRes = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
    config: { taskType: "SEMANTIC_SIMILARITY" }
  });
  if (!embeddingRes.embeddings) throw new Error("No embedding returned");
  const values = embeddingRes.embeddings[0].values;

  // 2. Upsert into Pinecone
  await index.upsert([
    {
      id: "manual_chunk_1",
      values,
      metadata: {
        text,
        source: "manual_script",
        description: "Manual upsert from test_client.js"
      }
    }
  ]);

  console.log("Upserted text into Pinecone!");
})();



