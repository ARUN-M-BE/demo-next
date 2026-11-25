import React from "react";
import { cn } from "../utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/70 dark:bg-white/10",
        className
      )}
      {...props}
    />
  );
}
