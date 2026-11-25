"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../utils/cn";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function GlassCard({
  children,
  className,
  hoverable = false,
  padding = "md",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3, transition: { duration: 0.18 } } : undefined}
      className={cn(
        "glass-panel rounded-2xl transition-all duration-200",
        hoverable && "glass-panel-hover",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
