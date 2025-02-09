"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

interface UpdateUserData {
    industry: string;
    experience: number; 
    bio: string;
    skills: string[];
  }
  
  export async function updateUser(data: UpdateUserData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    try {
      // Start a transaction to handle both operations
      const result = await db.$transaction(
        async (tx) => {
          // First check if industry exists
          let industryInsight = await tx.industryInsight.findUnique({
            where: {
              industry: data.industry,
            },
          });
  
          // If industry doesn't exist, create it with default values
          if (!industryInsight) {
            const insights = await generateAIInsights(data.industry);
            industryInsight = await db.industryInsight.create({
              data: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });

          }
  
          // Now update the user
          const updatedUser = await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              industry: data.industry,
              experience: data.experience,
              bio: data.bio,
              skills: data.skills,
            },
          });
  
          return { updatedUser, industryInsight };
        },
        {
          timeout: 10000, // default: 5000
        }
      );
  
      return result.updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating user and industry:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to update profile");
    }
  }
  
  export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    try {
      const userStatus = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
        select: {
          industry: true,
        },
      });
  
      return {
        isOnboarded: !!userStatus?.industry,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error checking onboarding status:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to check onboarding status");
    }
  }
  