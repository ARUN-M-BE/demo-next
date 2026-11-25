"use client";

import React, { useId } from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, error, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "h-10 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 text-sm text-slate-900 placeholder:text-slate-400",
            "dark:border-white/10 dark:bg-white/5 dark:text-white",
            "focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30",
            error && "border-rose-500",
            className
          )}
          {...props}
        />
        {error && (
          <p role="alert" className="text-xs text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
