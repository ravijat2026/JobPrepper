"use client";
import { getInterviewQuestions } from '@/actions/mock';
import { BarLoader } from 'react-spinners';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

type InterviewParams = {
  id: string;
};

type InterviewQuestion = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

type InterviewData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  jobTitle: string;
  jobDescription: string | null;
  questions: InterviewQuestion[];
};

type StartInterviewClientProps = {
  interviewData: InterviewData;
};

const StartInterviewClient = dynamic(
  () => import('./StartInterviewClient'),
  { ssr: false } // Disable SSR for this component
);

const StartInterview = ({ params }: { params: Promise<InterviewParams> }) => {
  const unwrappedParams = React.use(params);
  if (!unwrappedParams) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }
  const { id } = unwrappedParams;

  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const data = await getInterviewQuestions(id);
        if (data) {
          setInterviewData(data);
        }
      } catch (error) {
        console.error("Failed to fetch interview questions:", error);
      }
    };

    fetchInterviewData();
  }, [id]);

  if (!interviewData) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  return (
    <StartInterviewClient interviewData={interviewData} />
  );
};

export default StartInterview;