import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeClasses: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

export function Loader({ size = "md", label, className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Loader2
        className={cn("animate-spin text-primary-surface", sizeClasses[size])}
        aria-hidden="true"
      />
      {label ? (
        <span className="text-sm text-grayscale-textIcon-body">{label}</span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
}
