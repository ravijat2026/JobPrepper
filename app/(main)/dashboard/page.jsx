import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user"
import { redirect } from "next/navigation";
import DashboardView from "./_components/DashboardView";


const IndustryInsightsPage = async () => {

  const { isOnboarded } = await getUserOnboardingStatus();

  if(!isOnboarded){
    redirect('/onboarding');
  }

  const insights = await getIndustryInsights();


  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold">Industry Insights</h1>
      </div>
      <div className="container mx-auto">
      <DashboardView insights = {insights} />
      </div>
    </>
    
  )
}

export default IndustryInsightsPage