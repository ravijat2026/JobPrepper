"use client";
import { getInterviewQuestions } from '@/actions/mock';
import { BarLoader } from 'react-spinners';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'; // Import Accordion components
import { ArrowLeft} from 'lucide-react';
import Link from 'next/link'
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

const Result = ({ params }: { params: Promise<InterviewParams> }) => {
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
    <div> 
          <Link href="/mock-interview">
            <Button variant="link" className="gap-2 p-2 mb-2 text-lg">
              <ArrowLeft className="h-4 w-4" />
              Back to Interview Preparation
            </Button>
          </Link>
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-4xl">Interview Summary</CardTitle>
          <CardDescription className="flex justify-between w-full">
            <div>
              {format(new Date(interviewData.createdAt), "MMMM dd, yyyy HH:mm")}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interviewData.questions.map((question, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">Question {index + 1}: {question.question}</h3>
              <p className="mt-2">
                <strong>Your Answer:</strong> {interviewData.userAnswers[index] || "No answer recorded."}
              </p>

              {/* Accordion for Explanation */}
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="p-0 mt-2">
                    <div className='bg-secondary w-full text-md p-2'>Show Explanation</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="font-medium">Correct Answer:</p>
                      <p className="text-muted-foreground">{question.correctAnswer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Result;