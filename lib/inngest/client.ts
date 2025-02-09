import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "jobprep" , 
    name: "JobPrep",
    credentials: {
        gemini: {
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
        },
    },
});