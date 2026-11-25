"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 650,
  prefix = "",
  suffix = "",
  decimals = 2,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let rafId = 0;
    const startValue = displayValue;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (value - startValue) * eased);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, prefersReducedMotion]);

  const shownValue = prefersReducedMotion ? value : displayValue;

  return (
    <span className="tabular-nums">
      {prefix}
      {shownValue.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
