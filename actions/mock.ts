"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Question = {
    question: string;
    correctAnswer: string;
  };

if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
    throw new Error("API key for Google Generative AI is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateInterviewQuestions(jobPosition:string , jobDesc:string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const userSkills = user?.skills?.length ? user.skills.join(", "): "";

  const prompt = `
    Based on the given job role, description, and the user's skills, generate **4 high-quality technical interview questions with detailed answers and question should be short 15-20 words and asnwer should be 60-100 words.**.

        **Job Role:** ${jobPosition}
        **Job Description:** ${jobDesc}
        **User's Skills:** ${userSkills}

        The questions should be challenging and relevant to the job role. Ensure:
        - Questions align with the given job description ,Job Role and skills.
        - Answers are clear, well-structured, and informative.
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "correctAnswer": "string",
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const mock = JSON.parse(cleanedText);

    return mock.questions;

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}


export async function saveInterviewQuestions(
  jobPosition: string,
  jobDesc: string,
  questions: { question: string; correctAnswer: string }[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const savedInterview = await db.mockInterview.create({
      data: {
        userId: user.id,
        jobTitle: jobPosition,
        jobDescription: jobDesc,
        questions: questions.map((q) => ({
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: "", // Initially, userAnswer is empty
          isCorrect: false, // Initially, isCorrect is false
        })),
      },
    });

    return savedInterview;
  } catch (error) {
    console.error("Error saving interview questions:", error);
    throw new Error("Failed to save interview questions");
  }
}


type InterviewQuestion = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

export async function getInterviewQuestions(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const interview = await db.mockInterview.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!interview) throw new Error("Interview not found");

  const questions: InterviewQuestion[] = interview.questions as InterviewQuestion[];

  return {
    ...interview,
    questions, 
  };
}
