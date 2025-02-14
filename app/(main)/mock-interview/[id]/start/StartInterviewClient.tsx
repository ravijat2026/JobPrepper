"use client";
import { Button } from '@/components/ui/button';
import { Lightbulb, Volume2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';

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

const StartInterviewClient = ({ interviewData }: StartInterviewClientProps) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const typedResults = results as ResultType[];
      const newAnswer = typedResults[results.length - 1].transcript;
      setUserAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[activeQuestion] = newAnswer;
        return updatedAnswers;
      });
    }
  }, [results, activeQuestion]);

  const textToSpeech = (text:string)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
    else{
      alert('Your browser does not support text to speech');
    }
  }

  const handleQuestionChange = (index: number) => {
    setActiveQuestion(index);
  };

  const handleShowAllAnswers = () => {
    setShowAllAnswers(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <div className="p-5 my-10 border rounded-lg">
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {interviewData.questions.map((q, index) => (
              <div key={index}>
                <h2
                  className={`p-2 text-sm text-center cursor-pointer rounded-lg 
                  ${activeQuestion === index ? 'bg-gray-300 dark:bg-gray-600' : 'bg-outline'}`}
                  onClick={() => handleQuestionChange(index)}
                >
                  Question {index + 1}
                </h2>
              </div>
            ))}
          </div>
          <h2 className="my-5 text-md md:text-lg">
            {interviewData.questions[activeQuestion].question}
          </h2>

          <Volume2 className='cursor-pointer' onClick={() => textToSpeech(interviewData.questions[activeQuestion].question)}/>

          <div className="border rounded-lg p-5 dark:text-black bg-blue-100 mt-10 md:mt-20">
            <h2 className="flex gap-2 items-center">
              <Lightbulb />
              <strong>Note:</strong>
            </h2>
            <h2 className="text-sm">
              Click on Record Answer When you want to answer the question. At the end of the interview, we will give you feedback along with the correct answer for each question.
            </h2>
          </div>
        </div>

        {/* Video and Audio Recording */}
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center md:mt-10 h-[300px] justify-center bg-gray-800 flex-col rounded-lg">
            <Webcam
              mirrored={true}
              style={{
                height: 300,
                width: '100%',
              }}
            />
          </div>

          <Button
            className="my-10"
            variant="destructive"
            onClick={isRecording ? stopSpeechToText : startSpeechToText}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {/* Display the current answer for the active question */}
          <div className="mt-5 p-5 border rounded-lg w-full">
            <h2 className="text-lg font-bold">Your Answer:</h2>
            <p>{userAnswers[activeQuestion]}</p>
          </div>

          {/* Button to show all answers */}
          <Button
            className="mt-5"
            variant="outline"
            onClick={handleShowAllAnswers}
          >
            Show All Answers
          </Button>
        </div>
      </div>

      {/* Modal or Section to Display All Answers */}
      {showAllAnswers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-5">All Answers</h2>
            {interviewData.questions.map((q, index) => (
              <div key={index} className="mb-5">
                <h3 className="font-semibold">Question {index + 1}: {q.question}</h3>
                <p><strong>Your Answer:</strong> {userAnswers[index] || "No answer recorded."}</p>
              </div>
            ))}
            <Button
              className="mt-5"
              onClick={() => setShowAllAnswers(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StartInterviewClient;