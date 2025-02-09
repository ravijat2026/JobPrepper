import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
    throw new Error("API key for Google Generative AI is not set.");
  }
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights",
    id: "generate_industry_insights",
   },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );
      const part = res.response?.candidates?.[0]?.content?.parts?.[0];

      let cleanedText = "";

      if (part && typeof part === "object" && "text" in part) {
        cleanedText = part.text;
      } else {
        cleanedText = "";
      } 

      const cleanedTextTrimmed = cleanedText.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedTextTrimmed);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);