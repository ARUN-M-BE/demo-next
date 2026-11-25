"use client";

import React, { useId } from "react";
import { cn } from "../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Accessible multi-line textarea with label, helper text, and error feedback.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      id,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "flex w-full rounded-lg border bg-grayscale-surface-subtle px-3 py-2 text-sm text-grayscale-textIcon-title",
            "placeholder:text-grayscale-textIcon-caption transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-border",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error-border-hover focus:border-error-border-hover focus:ring-error-surface/30"
              : "border-grayscale-border hover:border-grayscale-border-hover",
            className
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
