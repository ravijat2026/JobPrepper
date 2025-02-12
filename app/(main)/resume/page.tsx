"use client";

import { useEffect, useState } from "react";
import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

type ResumeType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  feedback: string | null;
};

const Resume = () => {
  const [resume, setResume] = useState<ResumeType | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResume();
        setResume(data);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      }
    };

    fetchResume();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content || ""} />
    </div>
  );
};

export default Resume;
