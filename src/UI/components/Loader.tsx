import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Loader({ size = "md", label, className }: LoaderProps) {
  return (
    <div role="status" className={cn("inline-flex items-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin text-cyan-400",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-6 w-6",
          size === "lg" && "h-8 w-8"
        )}
      />
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
}
