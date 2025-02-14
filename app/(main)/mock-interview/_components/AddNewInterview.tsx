"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoaderCircle, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateInterviewQuestions, saveInterviewQuestions, getMockInterviews } from "@/actions/mock";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState<InterviewQuestion[]>([]);
  const [interviews, setInterviews] = useState<InterviewData[]>([]); 
  const [fetchingInterviews, setFetchingInterviews] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getMockInterviews();
        setInterviews(data);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setFetchingInterviews(false);
      }
    };

    fetchInterviews();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!jobPosition || !jobDesc) {
      alert("Please enter job position and description.");
      return;
    }

    try {
      const response = await generateInterviewQuestions(jobPosition, jobDesc);
      setQuestionsData(response);

      if (response.length > 0) {
        const savedInterview = await saveInterviewQuestions(jobPosition, jobDesc, response,[]);
        setOpenDialog(false);
        if(savedInterview && savedInterview.id){
          router.push(`/mock-interview/${savedInterview.id}`);
        }
        
      }

      console.log("Generated Questions:", response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-64 mb-6">
        <CardHeader>
          <CardTitle className="text-center">
            <Button type="button" onClick={() => setOpenDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      <h1 className="text-3xl md:text-4xl font-bold">Recent Interviews</h1>
      <h3 className="text-sm py-1 mb-4">Review your past interviews</h3>
      {/* Display Saved Interviews */}
      {fetchingInterviews ? (
        <div className="flex justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{interview.jobTitle}</CardTitle>
                <CardDescription>
                  Created {format(new Date(interview.createdAt), "MMMM dd, yyyy HH:mm")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {interview.jobDescription}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push(`/mock-interview/${interview.id}/result`)}
                  variant="outline"
                >
                  Show Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tell us more about your job</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <h2>Add details about your job role, job description, and your skills.</h2>
              <div className="mt-7 my-3">
                <label className="font-semibold">Job Role</label>
                <Input
                  className="mt-2"
                  placeholder="eg. Software Developer"
                  required
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>

              <div className="my-3">
                <label className="font-semibold">Job Description</label>
                <Textarea
                  className="mt-2"
                  placeholder="Write your job description..."
                  required
                  onChange={(event) => setJobDesc(event.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AddNewInterview;