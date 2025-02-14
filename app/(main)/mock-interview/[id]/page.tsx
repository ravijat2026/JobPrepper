"use client";
import { getInterviewQuestions } from '@/actions/mock';
import { Button } from '@/components/ui/button';
import { WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import Webcam from 'react-webcam'

type InterviewParams = {
  id: string;
};

type InterviewQuestion = {
  question: string;
  correctAnswer: string;
};

type InterviewData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  jobTitle: string;
  jobDescription: string | null;  
  questions: InterviewQuestion[];
  userAnswers: string[];
};

const Interview = ({ params }: { params: Promise<InterviewParams> }) => {
  // Unwrap the promise with `React.use()`
  const unwrappedParams = React.use(params);

  if (!unwrappedParams) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  const { id } = unwrappedParams;
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  const [webcamEnabled , setWebcamEnabled] = useState(false);

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
    <>
      <div className='my-10 flex gap-6 items-center justify-center flex-col'>
        <h2 className='font-bold text-3xl md:text-5xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1 mt-6 md:grid-cols-2 gap-8'>
          <div>
            {  webcamEnabled ?
              <Webcam
                onUserMedia={()=>setWebcamEnabled(true)}
                onUserMediaError={()=>setWebcamEnabled(false)}
                mirrored = {true}
                style={{
                  height:300,
                  width:450
                }}
              /> :
              <div className='flex items-center justify-center flex-col gap-4'>
              <WebcamIcon className='h-[300px] w-[450px] p-10 bg-secondary border rounded-md'/>
              <Button variant= 'destructive' onClick={()=>setWebcamEnabled(true)}>Enable Webcam and Microphone</Button>
              </div>
            }
          </div>

          <div className='flex flex-col justify-between gap-3'>
            <div>
              <h1 className='text-lg'><strong>Job Role: </strong>{interviewData?.jobTitle}</h1>
              <h1 className='text-lg'><strong>Job Description: </strong>{interviewData?.jobDescription}</h1>
            </div>
            <Link href ={`/mock-interview/${interviewData.id}/start`}>
              <Button className='w-36'>Start Interview</Button>
            </Link>
            
          </div>
        </div>
    
      </div>
    </>
  );
};

export default Interview;