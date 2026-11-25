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
  | "GOLD18_VS_GOLD24";

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
  GOLD18_VS_GOLD24: {
    label: "18K Gold vs 24K Gold",
    a: "GOLD_18K",
    aName: "18K Gold (%)",
    b: "GOLD_24K",
    bName: "24K Gold (%)",
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
          setDisclosure("Insufficient historical points returned for comparison.");
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
          `Normalized percentage return from start of ${timeframe} window (IBJA AM/PM daily benchmarks).`
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
    <section aria-label="Precious Metals Comparison Analytics">
      <ChartCard
        title="Gold & Silver Normalized Performance"
        subtitle={disclosure || "Compare normalized percentage returns across Indian bullion benchmarks"}
        isLoading={loading}
        isEmpty={!loading && merged.length === 0}
        emptyMessage={disclosure || "No overlapping dates available for this pair."}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={pair}
              onChange={(e) => {
                setLoading(true);
                setPair(e.target.value as ComparisonPair);
              }}
              options={Object.entries(PAIR_CONFIG).map(([value, item]) => ({
                value,
                label: item.label,
              }))}
              containerClassName="w-52"
            />
            <TimeframeSelector
              value={timeframe}
              onChange={(tf) => {
                setLoading(true);
                setTimeframe(tf);
              }}
            />
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
