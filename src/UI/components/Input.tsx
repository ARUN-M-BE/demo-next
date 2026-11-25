"use client";

import React, { useId } from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Accessible text input with label, icons, helper text, and validation error state.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
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
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-grayscale-textIcon-caption">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "flex h-10 w-full rounded-lg border bg-grayscale-surface-subtle px-3 py-2 text-sm text-grayscale-textIcon-title",
              "placeholder:text-grayscale-textIcon-caption",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-border",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-error-border-hover focus:border-error-border-hover focus:ring-error-surface/30"
                : "border-grayscale-border hover:border-grayscale-border-hover",
              leftIcon && "pl-9",
              rightElement && "pr-9",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-error-textIcon-link-label">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-grayscale-textIcon-caption">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
