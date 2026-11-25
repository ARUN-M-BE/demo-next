import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Loader } from "@/UI";
import { AnalyticsDashboard } from "@/features/analytics/components/AnalyticsDashboard";

async function DashboardWithUser() {
  let userName: string | null = null;
  let userEmail: string | null = null;

  try {
    const user = await currentUser();
    if (user) {
      userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "Authenticated User";
      userEmail = user.emailAddresses[0]?.emailAddress ?? null;
    }
  } catch {
    // Graceful fallback when Clerk keys are not yet configured
  }

  return <AnalyticsDashboard userName={userName} userEmail={userEmail} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-analytics-canvas flex min-h-screen items-center justify-center">
          <Loader size="lg" label="Loading analytics dashboard..." />
        </div>
      }
    >
      <DashboardWithUser />
    </Suspense>
  );
}
