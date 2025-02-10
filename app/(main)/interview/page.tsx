import { getAssessments } from "@/actions/interview";

export default async function InterviewPrepPage(){
    const assessments = await getAssessments();

    return(
        <div>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bond"> 
                    Interview Preparation
                </h1>
            </div>
        </div>
    )

}