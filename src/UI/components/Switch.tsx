"use client";

import React, { useId } from "react";
import { cn } from "../utils/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Accessible toggle switch control with smooth thumb transition.
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  id,
  className,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {(label || description) && (
        <label
          htmlFor={switchId}
          className={cn(
            "flex flex-col select-none",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          )}
        >
          {label && (
            <span className="text-sm font-medium text-grayscale-textIcon-title">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-grayscale-textIcon-body">
              {description}
            </span>
          )}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          checked
            ? "border-primary-border bg-primary-surface"
            : "border-grayscale-border bg-grayscale-surface"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-elevation-xs transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
