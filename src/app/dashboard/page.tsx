import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Loader } from "@/UI";
import { getFullMarketOverview } from "@/lib/services/marketDataService";
import { MarketTerminal } from "@/features/market/MarketTerminal";

async function TerminalWithUser() {
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  );

  const [initialOverview, userName] = await Promise.all([
    getFullMarketOverview(),
    (async () => {
      if (!hasClerkKey) return null;
      try {
        const user = await currentUser();
        if (user) {
          return (
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.username ||
            "Authenticated Analyst"
          );
        }
      } catch {
        return null;
      }
      return null;
    })(),
  ]);

  return (
    <MarketTerminal userName={userName} initialOverview={initialOverview} />
  );
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
