"use client";

import React, { useEffect, useState } from "react";
import type { HistoricalSeriesResponse, MarketAssetId, Timeframe } from "@/types/market";
import { ComparisonChart } from "../charts/ComparisonChart";
import { ChartCard } from "../components/ChartCard";
import { Select } from "../components/Select";
import { TimeframeSelector } from "../components/TimeframeSelector";

type ComparisonPair =
  | "GOLD24_VS_SILVER"
  | "GOLD22_VS_GOLD24"
  | "GOLD_VS_SENSEX"
  | "SILVER_VS_SENSEX";

const PAIR_CONFIG: Record<
  ComparisonPair,
  { label: string; a: MarketAssetId; aName: string; b: MarketAssetId; bName: string }
> = {
  GOLD24_VS_SILVER: {
    label: "24K Gold vs Silver",
    a: "GOLD_24K",
    aName: "24K Gold (%)",
    b: "SILVER",
    bName: "Silver (%)",
  },
  GOLD22_VS_GOLD24: {
    label: "22K Gold vs 24K Gold",
    a: "GOLD_22K",
    aName: "22K Gold (%)",
    b: "GOLD_24K",
    bName: "24K Gold (%)",
  },
  GOLD_VS_SENSEX: {
    label: "24K Gold vs BSE SENSEX",
    a: "GOLD_24K",
    aName: "24K Gold (%)",
    b: "SENSEX",
    bName: "BSE SENSEX (%)",
  },
  SILVER_VS_SENSEX: {
    label: "Silver vs BSE SENSEX",
    a: "SILVER",
    aName: "Silver (%)",
    b: "SENSEX",
    bName: "BSE SENSEX (%)",
  },
};

export function ComparisonSection() {
  const [pair, setPair] = useState<ComparisonPair>("GOLD24_VS_SILVER");
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [loading, setLoading] = useState(true);
  const [merged, setMerged] = useState<Array<Record<string, string | number>>>([]);
  const [disclosure, setDisclosure] = useState("");

  const cfg = PAIR_CONFIG[pair];

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetch(`/api/market/history?asset=${cfg.a}&timeframe=${timeframe}`).then((r) =>
        r.json()
      ) as Promise<HistoricalSeriesResponse>,
      fetch(`/api/market/history?asset=${cfg.b}&timeframe=${timeframe}`).then((r) =>
        r.json()
      ) as Promise<HistoricalSeriesResponse>,
    ])
      .then(([resA, resB]) => {
        if (!active) return;
        const ptsA = resA.points ?? [];
        const ptsB = resB.points ?? [];

        if (ptsA.length === 0 || ptsB.length === 0) {
          setMerged([]);
          setDisclosure("One or both providers returned insufficient historical points for comparison.");
          setLoading(false);
          return;
        }

        const baseA = ptsA[0].close || 1;
        const baseB = ptsB[0].close || 1;
        const mapB = new Map(
          ptsB.map((p) => [p.time, Number((((p.close - baseB) / baseB) * 100).toFixed(2))])
        );

        const rows = ptsA
          .filter((p) => mapB.has(p.time))
          .map((p) => ({
            time: p.time,
            a: Number((((p.close - baseA) / baseA) * 100).toFixed(2)),
            b: mapB.get(p.time) ?? 0,
          }));

        setMerged(rows);
        setDisclosure(
          resA.interval !== resB.interval
            ? `Note: ${cfg.aName} (${resA.interval}) and ${cfg.bName} (${resB.interval}) use different sampling intervals.`
            : `Normalized percentage return from start of ${timeframe} window.`
        );
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cfg.a, cfg.b, cfg.aName, cfg.bName, timeframe]);

  return (
    <section aria-label="Asset Price Comparison Analytics">
      <ChartCard
        title="Cross-Asset Normalized Performance"
        subtitle={disclosure || "Compare normalized percentage returns across Indian benchmarks"}
        isLoading={loading}
        isEmpty={!loading && merged.length === 0}
        emptyMessage={disclosure || "No overlapping dates available for this pair."}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={pair}
              onChange={(e) => setPair(e.target.value as ComparisonPair)}
              options={Object.entries(PAIR_CONFIG).map(([value, item]) => ({
                value,
                label: item.label,
              }))}
              containerClassName="w-52"
            />
            <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          </div>
        }
      >
        <ComparisonChart
          data={merged}
          series={[
            { key: "a", name: cfg.aName, color: "#F59E0B" },
            { key: "b", name: cfg.bName, color: "#22D3EE" },
          ]}
        />
      </ChartCard>
    </section>
  );
}
