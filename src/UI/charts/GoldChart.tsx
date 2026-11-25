"use client";

import React from "react";
import type { OhlcPoint } from "@/types/market";
import { AreaChart } from "./AreaChart";

export function GoldChart({ points, height = 250 }: { points: OhlcPoint[]; height?: number }) {
  return (
    <AreaChart
      data={points.map((p) => ({ time: p.time, close: p.close }))}
      xKey="time"
      height={height}
      series={[{ key: "close", name: "IBJA Gold (INR/g)", color: "#F59E0B" }]}
    />
  );
}
