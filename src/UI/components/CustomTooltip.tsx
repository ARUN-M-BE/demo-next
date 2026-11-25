"use client";

import React from "react";

export interface CustomTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  label?: string;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/90 px-3.5 py-2.5 text-xs text-slate-100 shadow-elevation-lg backdrop-blur-xl">
      {label && <p className="mb-1.5 font-semibold text-slate-200">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry, idx) => (
          <div key={`${entry.name ?? "s"}-${idx}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color ?? "#22D3EE" }}
              />
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums text-white">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString("en-IN")
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
