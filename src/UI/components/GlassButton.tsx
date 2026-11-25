"use client";

import React from "react";
import { cn } from "../utils/cn";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
        "disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
        variant === "default" &&
          "glass-panel text-slate-900 dark:text-slate-100 hover:border-cyan-400/40",
        variant === "accent" &&
          "bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-semibold shadow-elevation-sm hover:brightness-110",
        variant === "ghost" &&
          "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/10",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-9 px-3.5 text-sm",
        size === "lg" && "h-11 px-5 text-sm",
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
);
GlassButton.displayName = "GlassButton";
