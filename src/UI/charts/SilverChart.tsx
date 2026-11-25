"use client";

import React from "react";
import type { OhlcPoint } from "@/types/market";
import { AreaChart } from "./AreaChart";

export function SilverChart({ points, height = 250 }: { points: OhlcPoint[]; height?: number }) {
  return (
    <AreaChart
      data={points.map((p) => ({ time: p.time, close: p.close }))}
      xKey="time"
      height={height}
      series={[{ key: "close", name: "IBJA Silver (INR/g)", color: "#94A3B8" }]}
    />
  );
}
