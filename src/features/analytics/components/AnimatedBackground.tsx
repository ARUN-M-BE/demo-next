"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = [
  { id: 1, x: "12%", y: "18%", size: 4, delay: 0 },
  { id: 2, x: "28%", y: "64%", size: 3, delay: 1.2 },
  { id: 3, x: "48%", y: "24%", size: 5, delay: 0.6 },
  { id: 4, x: "72%", y: "42%", size: 3.5, delay: 1.8 },
  { id: 5, x: "86%", y: "74%", size: 4.5, delay: 0.9 },
  { id: 6, x: "62%", y: "82%", size: 3, delay: 2.1 },
];

/**
 * Subtle animated glassmorphism background with gradient orbs, network lines, and floating particles.
 */
export function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle gradient orbs */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 30, -15, 0], y: [0, -25, 15, 0] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500/12 blur-3xl dark:bg-blue-500/18"
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, -25, 20, 0], y: [0, 20, -20, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/14"
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 20, -20, 0], y: [0, -15, 25, 0] }
        }
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/14"
      />

      {/* Connected network lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.1]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="12%" y1="18%" x2="48%" y2="24%" stroke="#22D3EE" strokeWidth="1" />
        <line x1="48%" y1="24%" x2="72%" y2="42%" stroke="#3B82F6" strokeWidth="1" />
        <line x1="72%" y1="42%" x2="86%" y2="74%" stroke="#8B5CF6" strokeWidth="1" />
        <line x1="28%" y1="64%" x2="62%" y2="82%" stroke="#22D3EE" strokeWidth="1" />
      </svg>

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], opacity: [0.35, 0.85, 0.35] }
          }
          transition={{
            duration: 5.5,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        />
      ))}
    </div>
  );
}
