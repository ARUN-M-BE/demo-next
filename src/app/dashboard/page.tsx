import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Loader } from "@/UI";
import { MarketTerminal } from "@/features/market/MarketTerminal";

async function TerminalWithUser() {
  let userName: string | null = null;
  try {
    const user = await currentUser();
    if (user) {
      userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "Authenticated Analyst";
    }
  } catch {
    // Graceful fallback when Clerk keys are not yet linked
  }

  return <MarketTerminal userName={userName} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-analytics-canvas flex min-h-screen items-center justify-center">
          <Loader size="lg" label="Loading Market Intelligence..." />
        </div>
      }
    >
      <TerminalWithUser />
    </Suspense>
  );
}
