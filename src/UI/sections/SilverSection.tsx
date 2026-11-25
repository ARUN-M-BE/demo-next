"use client";

import React, { useEffect, useState } from "react";
import { useMarketStore } from "@/store/marketStore";
import type { HistoricalSeriesResponse, Timeframe } from "@/types/market";
import { SilverChart } from "../charts/SilverChart";
import { ChartCard } from "../components/ChartCard";
import { PriceCard } from "../components/PriceCard";
import { TimeframeSelector } from "../components/TimeframeSelector";

export function SilverSection() {
  const { silver, spot } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [history, setHistory] = useState<HistoricalSeriesResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(`/api/market/history?asset=SILVER&timeframe=${timeframe}`, {
      cache: "no-store",
    })
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
  }, [timeframe]);

  return (
    <section aria-label="Indian Silver Benchmark & Spot" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PriceCard
          title="Silver (1 Gram)"
          subtitle={silver?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={silver?.perGram ?? null}
          change={silver?.changePerGram ?? null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="silver"
          timestamp={silver?.timestamp}
        />
        <PriceCard
          title="Silver (10 Grams)"
          subtitle={silver?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={silver?.per10Grams ?? null}
          change={silver?.changePerGram !== null && silver?.changePerGram !== undefined ? silver.changePerGram * 10 : null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="silver"
          timestamp={silver?.timestamp}
        />
        <PriceCard
          title="Silver (1 Kilogram)"
          subtitle={silver?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={silver?.perKg ?? null}
          change={silver?.changePerGram !== null && silver?.changePerGram !== undefined ? silver.changePerGram * 1000 : null}
          changePercent={silver?.changePercent ?? null}
          feedStatus={silver?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="silver"
          timestamp={silver?.timestamp}
        />
        <PriceCard
          title="Silver Spot (INR/g)"
          subtitle="International Indicative Spot Rate"
          sourceLabel={spot?.source ?? "XAUS"}
          price={spot?.silverSpotPerGram ?? null}
          secondaryLabel="USD/oz"
          secondaryValue={
            spot?.silverSpotUsdOz ? `$${spot.silverSpotUsdOz.toLocaleString("en-US")}` : undefined
          }
          change={null}
          changePercent={null}
          feedStatus={spot?.feedStatus ?? "DELAYED"}
          accent="cyan"
          timestamp={spot?.timestamp}
        />
      </div>

      <ChartCard
        title="Silver IBJA Historical Trend"
        subtitle={`Source: ${history?.provider ?? "IBJA (api.dharun.dev)"} • Timeframe: ${timeframe}`}
        isLoading={loadingHistory}
        isEmpty={!loadingHistory && (history?.points.length ?? 0) === 0}
        emptyMessage={history?.message ?? "No silver historical data returned."}
        action={<TimeframeSelector value={timeframe} onChange={setTimeframe} />}
      >
        <SilverChart points={history?.points ?? []} />
      </ChartCard>
    </section>
  );
}
