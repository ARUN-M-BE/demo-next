"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface CountryMarkerData {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lng, lat]
  visitors: number;
  sessions: number;
  conversionRate: number;
  change: number;
}

export interface MapTooltipProps {
  country: CountryMarkerData | null;
  position: { x: number; y: number } | null;
}

export function MapTooltip({ country, position }: MapTooltipProps) {
  if (!country || !position) return null;

  const positive = country.change >= 0;

  return (
    <div
      role="status"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -115%)",
      }}
      className="pointer-events-none absolute z-30 w-52 rounded-xl border border-white/15 bg-slate-950/92 p-3 text-xs text-slate-100 shadow-elevation-lg backdrop-blur-xl"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-semibold text-white">{country.name}</span>
        <span
          className={`inline-flex items-center gap-0.5 font-semibold ${
            positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(country.change).toFixed(1)}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-300">
        <span>Visitors</span>
        <span className="text-right font-semibold tabular-nums text-white">
          {country.visitors.toLocaleString("en-US")}
        </span>
        <span>Sessions</span>
        <span className="text-right font-semibold tabular-nums text-white">
          {country.sessions.toLocaleString("en-US")}
        </span>
        <span>Conv. Rate</span>
        <span className="text-right font-semibold tabular-nums text-cyan-300">
          {country.conversionRate.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
