import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance";
import QuizList from "./_components/quiz-list";

type QuestionResult = {
  question: string;
  userAnswer: string;
  answer: string;
  isCorrect: boolean;
  explanation: string;
};

type Assessment = {
  id: string;
  quizScore: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  category: string;
  improvementTip?: string;
  questions: QuestionResult[];
};

export default async function InterviewPrepPage() {
    const assessmentsRaw = await getAssessments();
    
    const assessments: Assessment[] = assessmentsRaw.map((assessment) => ({
        ...assessment,
        createdAt: assessment.createdAt instanceof Date ? assessment.createdAt.toISOString() : assessment.createdAt,
        updatedAt: assessment.updatedAt instanceof Date ? assessment.updatedAt.toISOString() : assessment.updatedAt,
        improvementTip: assessment.improvementTip || undefined,
        questions: assessment.questions as QuestionResult[],
    }));

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bold"> 
                    Interview Preparation
                </h1>
            </div>
            <div className="space-y-6">
                <StatsCards assessments={assessments} />
                <PerformanceChart assessments={assessments} />
                <QuizList assessments={assessments} />
            </div>
        </div>
    );
}
