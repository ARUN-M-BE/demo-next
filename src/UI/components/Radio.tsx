"use client";

import React, { useId } from "react";
import { cn } from "../utils/cn";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  label?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

/**
 * Accessible radio group component with keyboard and screen-reader support.
 */
export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label && (
        <legend className="text-sm font-medium text-grayscale-textIcon-title mb-1">
          {label}
        </legend>
      )}
      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`;
          const isChecked = value === opt.value;

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={cn(
                "inline-flex items-start gap-2.5 select-none",
                opt.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              )}
            >
              <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                <input
                  id={optId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isChecked}
                  disabled={opt.disabled}
                  onChange={() => onChange?.(opt.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    "border-grayscale-border bg-grayscale-surface-subtle",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1",
                    isChecked && "border-primary-border"
                  )}
                >
                  {isChecked && (
                    <span className="h-2 w-2 rounded-full bg-primary-surface" />
                  )}
                </span>
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-grayscale-textIcon-title leading-tight">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-grayscale-textIcon-body mt-0.5">
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
