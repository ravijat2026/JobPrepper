"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoaderCircle, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateInterviewQuestions, saveInterviewQuestions } from "@/actions/mock";
import { useRouter } from "next/navigation";

type Question = {
    question: string;
    correctAnswer: string;
};

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);

  const router = useRouter();

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
        const savedInterview = await saveInterviewQuestions(jobPosition, jobDesc, response);
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
      <Card className="w-64">
        <CardHeader>
          <CardTitle className="text-center">
            <Button type="button" onClick={() => setOpenDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

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