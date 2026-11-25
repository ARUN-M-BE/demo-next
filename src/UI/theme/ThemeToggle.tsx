"use client";

import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/cn";

export interface ThemeToggleProps {
  className?: string;
  showSystemOption?: boolean;
  size?: "sm" | "md";
}

/**
 * Interactive dark/light (and optional system) theme switcher using UI Astra tokens.
 */
export function ThemeToggle({
  className,
  showSystemOption = false,
  size = "md",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (showSystemOption) {
    const options: Array<{
      value: "light" | "dark" | "system";
      label: string;
      icon: React.ReactNode;
    }> = [
      { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
      { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
      {
        value: "system",
        label: "System",
        icon: <Monitor className="h-3.5 w-3.5" />,
      },
    ];

    return (
      <div
        role="group"
        aria-label="Theme mode"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg border border-grayscale-border bg-grayscale-surface-subtle p-1",
          className
        )}
      >
        {options.map((opt) => {
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              aria-pressed={active}
              title={`${opt.label} theme`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                active
                  ? "bg-background text-grayscale-textIcon-title shadow-elevation-xs"
                  : "text-grayscale-textIcon-body hover:text-grayscale-textIcon-title"
              )}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-grayscale-border bg-grayscale-surface-subtle text-grayscale-textIcon-title transition-colors",
        "hover:bg-grayscale-surface-hover hover:border-grayscale-border-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-warning-400" />
      ) : (
        <Moon className="h-4 w-4 text-grayscale-textIcon-subtitle" />
      )}
    </button>
  );
}
