"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
    throw new Error("API key for Google Generative AI is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

type ResumeType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    content: string;
    atsScore: number | null;
    feedback: string | null;
  };


export async function saveResume(content :string) : Promise<ResumeType> {
    const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
    
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    
      if (!user) throw new Error("User not found");

      try{
        const resume = await db.resume.upsert({
            where:{
                userId: user.id,
            },
            update: {
                content,
            },
            create: {
                userId: user.id,
                content,
            },
        });

        revalidatePath("/resume");
        return resume;
      } catch(error){
        console.log("Error saving resume: ", error);
        throw new Error("Failed to save resume");
      }
}

export async function  getResume(){
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");

    return await db.resume.findUnique({
        where: {
            userId:user.id,
        },
    });
    
}

type ImproveWithAIParams = {
    current: string;
    type: string;
};

export async function improveWithAI({ current, type } : ImproveWithAIParams) : Promise<string> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });
  
    if (!user) throw new Error("User not found");
  
    const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
      Make it more impactful, quantifiable, and aligned with industry standards.
      Current content: "${current}"
  
      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      
      Format the response as a single paragraph without any additional text or explanations.
    `;
  
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const improvedContent = response.text().trim();
      return improvedContent;
    } catch (error) {
      console.error("Error improving content:", error);
      throw new Error("Failed to improve content");
    }
  }