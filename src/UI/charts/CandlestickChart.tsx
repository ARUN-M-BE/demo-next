"use client";

import React, { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type Time,
} from "lightweight-charts";
import type { OhlcPoint } from "@/types/market";

export interface CandlestickChartProps {
  points: OhlcPoint[];
  height?: number;
}

export function CandlestickChart({ points, height = 310 }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || points.length === 0) return;

    const chart = createChart(el, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94A3B8",
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.12)" },
        horzLines: { color: "rgba(148, 163, 184, 0.12)" },
      },
      crosshair: { mode: 1 },
      timeScale: { borderColor: "rgba(148, 163, 184, 0.2)" },
      rightPriceScale: { borderColor: "rgba(148, 163, 184, 0.2)" },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#F43F5E",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#F43F5E",
    });

    const formatted: CandlestickData<Time>[] = points.map((p) => ({
      time: p.time as Time,
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
    }));

    series.setData(formatted);
    chart.timeScale().fitContent();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [points, height]);

  if (points.length === 0) return null;
  return <div ref={containerRef} className="w-full" style={{ height }} />;
}
