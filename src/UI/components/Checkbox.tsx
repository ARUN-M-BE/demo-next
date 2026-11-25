"use client";

import React, { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "../utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

/**
 * Accessible checkbox control with custom UI Astra styling.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-start gap-2.5 select-none",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            className
          )}
        >
          <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              aria-invalid={Boolean(error) || undefined}
              className="peer sr-only"
              {...props}
            />
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                "border-grayscale-border bg-grayscale-surface-subtle",
                "peer-hover:border-grayscale-border-hover",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1",
                "peer-checked:border-primary-border peer-checked:bg-primary-surface peer-checked:text-neutral-1150"
              )}
            >
              <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            {checked && (
              <Check
                className="pointer-events-none absolute h-3 w-3 text-neutral-1150"
                aria-hidden="true"
              />
            )}
          </span>
          {(label || description) && (
            <span className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-grayscale-textIcon-title leading-tight">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-xs text-grayscale-textIcon-body mt-0.5">
                  {description}
                </span>
              )}
            </span>
          )}
        </label>
        {error && (
          <p role="alert" className="text-xs text-error-textIcon-link-label">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
