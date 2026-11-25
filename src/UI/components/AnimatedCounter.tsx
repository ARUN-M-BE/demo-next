"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
}

/**
 * Smoothly animates numeric values with reduced-motion support.
 */
export function AnimatedCounter({
  value,
  duration = 700,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let rafId = 0;
    const startValue = displayValue;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (value - startValue) * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, prefersReducedMotion]);

  const formatted = compact
    ? displayValue >= 1_000_000
      ? `${(displayValue / 1_000_000).toFixed(2)}M`
      : displayValue >= 1_000
      ? `${(displayValue / 1_000).toFixed(1)}K`
      : displayValue.toFixed(decimals)
    : displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
