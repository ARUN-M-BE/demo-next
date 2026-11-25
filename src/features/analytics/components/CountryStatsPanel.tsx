"use client";

import React from "react";
import { Globe2 } from "lucide-react";
import { ProgressBar } from "@/UI";
import type { CountryStats } from "../types/analytics";

export interface CountryStatsPanelProps {
  countries: CountryStats[];
  selectedCountryId: string | null;
  onSelect: (id: string | null) => void;
}

export function CountryStatsPanel({
  countries,
  selectedCountryId,
  onSelect,
}: CountryStatsPanelProps) {
  const maxVisitors = Math.max(...countries.map((c) => c.visitors), 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Globe2 className="h-3.5 w-3.5 text-cyan-500" />
          <span>Top Regions</span>
        </div>
        {selectedCountryId && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs font-medium text-cyan-600 hover:underline dark:text-cyan-400 cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {countries.map((country) => {
          const active = selectedCountryId === country.id;
          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelect(active ? null : country.id)}
              className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                active
                  ? "border-cyan-400/60 bg-cyan-400/10"
                  : "border-slate-200/70 bg-white/50 hover:border-cyan-400/35 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {country.name}
                </span>
                <span className="tabular-nums text-slate-600 dark:text-slate-300">
                  {country.visitors.toLocaleString("en-US")}
                </span>
              </div>
              <ProgressBar value={country.visitors} max={maxVisitors} />
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Conv. {country.conversionRate.toFixed(2)}%</span>
                <span
                  className={
                    country.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  }
                >
                  {country.change >= 0 ? "+" : ""}
                  {country.change.toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
