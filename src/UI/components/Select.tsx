"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

/**
 * Styled native select control with label, placeholder, and validation error support.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-grayscale-textIcon-title"
          >
            {label}
            {required && (
              <span className="ml-1 text-error-surface" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border bg-grayscale-surface-subtle px-3 pr-9 text-sm text-grayscale-textIcon-title",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-border",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-error-border-hover"
                : "border-grayscale-border hover:border-grayscale-border-hover",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grayscale-textIcon-caption"
            aria-hidden="true"
          />
        </div>
        {error ? (
          <p role="alert" className="text-xs text-error-textIcon-link-label">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-grayscale-textIcon-caption">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";
