"use client";

import React, { useEffect, useState } from "react";
import { useMarketStore } from "@/store/marketStore";
import type { HistoricalSeriesResponse, Timeframe } from "@/types/market";
import { SilverChart } from "../charts/SilverChart";
import { ChartCard } from "../components/ChartCard";
import { PriceCard } from "../components/PriceCard";
import { TimeframeSelector } from "../components/TimeframeSelector";

export function SilverSection() {
  const { silver, city } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [history, setHistory] = useState<HistoricalSeriesResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(
      `/api/market/history?asset=SILVER&timeframe=${timeframe}&city=${encodeURIComponent(city)}`,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((data: HistoricalSeriesResponse) => {
        if (active) {
          setHistory(data);
          setLoadingHistory(false);
        }
      })
      .catch(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [timeframe, city]);

  return (
    <section aria-label="Indian Silver Price Analytics" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PriceCard
          title="Silver (1 Gram)"
          subtitle={silver?.rateTypeLabel}
          price={silver?.perGram ?? null}
          change={silver?.changePerGram ?? null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "UNCONFIGURED"}
          accent="silver"
          timestamp={silver?.timestamp}
          missingEnv={silver?.missingEnv}
        />
        <PriceCard
          title="Silver (10 Grams)"
          subtitle={silver?.rateTypeLabel}
          price={silver?.per10Grams ?? null}
          change={silver?.changePerGram !== null && silver?.changePerGram !== undefined ? silver.changePerGram * 10 : null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "UNCONFIGURED"}
          accent="silver"
          timestamp={silver?.timestamp}
          missingEnv={silver?.missingEnv}
        />
        <PriceCard
          title="Silver (100 Grams)"
          subtitle={silver?.rateTypeLabel}
          price={silver?.per100Grams ?? null}
          change={silver?.changePerGram !== null && silver?.changePerGram !== undefined ? silver.changePerGram * 100 : null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "UNCONFIGURED"}
          accent="silver"
          timestamp={silver?.timestamp}
          missingEnv={silver?.missingEnv}
        />
        <PriceCard
          title="Silver (1 Kilogram)"
          subtitle={silver?.rateTypeLabel}
          price={silver?.perKg ?? null}
          secondaryLabel="Day High / Low"
          secondaryValue={
            silver?.dayHighPerKg && silver?.dayLowPerKg
              ? `₹${silver.dayHighPerKg} / ₹${silver.dayLowPerKg}`
              : undefined
          }
          change={silver?.changePerGram !== null && silver?.changePerGram !== undefined ? silver.changePerGram * 1000 : null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "UNCONFIGURED"}
          accent="silver"
          timestamp={silver?.timestamp}
          missingEnv={silver?.missingEnv}
        />
      </div>

      <ChartCard
        title="Silver Historical Trend"
        subtitle={`City: ${city} • Timeframe: ${timeframe}`}
        isLoading={loadingHistory}
        isEmpty={!loadingHistory && (history?.points.length ?? 0) === 0}
        emptyMessage={
          history?.message ??
          "No silver historical data available. Configure METALS_API_KEY in .env.local."
        }
        action={<TimeframeSelector value={timeframe} onChange={setTimeframe} />}
      >
        <SilverChart points={history?.points ?? []} />
      </ChartCard>
    </section>
  );
}
