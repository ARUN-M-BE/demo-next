"use client";

import React from "react";
import type { OhlcPoint } from "@/types/market";
import { AreaChart } from "./AreaChart";

export interface SilverChartProps {
  points: OhlcPoint[];
  height?: number;
}

export function SilverChart({ points, height = 250 }: SilverChartProps) {
  const data = points.map((p) => ({
    time: p.time,
    close: p.close,
  }));

  return (
    <AreaChart
      data={data}
      xKey="time"
      height={height}
      series={[{ key: "close", name: "Silver (INR)", color: "#94A3B8" }]}
    />
  );
}
