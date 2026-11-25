"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { DATE_RANGE_OPTIONS, type DateRangePreset } from "@/lib/constants";
import { cn } from "../utils/cn";

export interface DateRangePickerProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
  customStart?: string;
  customEnd?: string;
  onCustomChange?: (start: string, end: string) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  customStart = "2026-11-01",
  customEnd = "2026-11-25",
  onCustomChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <Calendar className="ml-2 h-3.5 w-3.5 text-cyan-500" aria-hidden="true" />
        {DATE_RANGE_OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                active
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-semibold shadow-elevation-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {value === "custom" && onCustomChange && (
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-2.5 py-1 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <input
            type="date"
            aria-label="Start date"
            value={customStart}
            onChange={(e) => onCustomChange(e.target.value, customEnd)}
            className="bg-transparent text-slate-800 focus:outline-none dark:text-slate-100"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            aria-label="End date"
            value={customEnd}
            onChange={(e) => onCustomChange(customStart, e.target.value)}
            className="bg-transparent text-slate-800 focus:outline-none dark:text-slate-100"
          />
        </div>
      )}
    </div>
  );
}
