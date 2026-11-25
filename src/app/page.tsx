import { Suspense } from "react";
import { Loader } from "@/UI";
import { getFullMarketOverview } from "@/lib/services/marketDataService";
import { MarketTerminal } from "@/features/market/MarketTerminal";

async function InstantTerminal() {
  const initialOverview = await getFullMarketOverview();
  return <MarketTerminal initialOverview={initialOverview} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-analytics-canvas flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Loader size="lg" label="Loading live market benchmarks..." />
        </div>
      }
    >
      <InstantTerminal />
    </Suspense>
  );
}
