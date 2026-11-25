"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = [
  { id: 1, x: "10%", y: "20%", size: 4, delay: 0 },
  { id: 2, x: "26%", y: "65%", size: 3, delay: 1.1 },
  { id: 3, x: "52%", y: "18%", size: 4.5, delay: 0.5 },
  { id: 4, x: "76%", y: "44%", size: 3.5, delay: 1.7 },
  { id: 5, x: "88%", y: "78%", size: 4, delay: 0.8 },
];

export function MarketBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle financial grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 30, -15, 0], y: [0, -20, 15, 0] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500/12 blur-3xl dark:bg-blue-500/18"
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, -25, 20, 0], y: [0, 20, -20, 0] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/14"
      />

      {/* Connected network lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.1]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10%" y1="20%" x2="52%" y2="18%" stroke="#22D3EE" strokeWidth="1" />
        <line x1="52%" y1="18%" x2="76%" y2="44%" stroke="#3B82F6" strokeWidth="1" />
        <line x1="76%" y1="44%" x2="88%" y2="78%" stroke="#8B5CF6" strokeWidth="1" />
      </svg>

      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -12, 0], opacity: [0.35, 0.85, 0.35] }
          }
          transition={{
            duration: 5.5,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-cyan-400/60"
        />
      ))}
    </div>
  );
}
