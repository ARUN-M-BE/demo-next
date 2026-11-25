import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-grayscale-border bg-grayscale-surface text-grayscale-textIcon-subtitle",
        primary:
          "border-primary-border/40 bg-primary-surface-subtle text-primary-700 dark:bg-primary-950/60 dark:text-primary-300",
        success:
          "border-success-border/40 bg-success-surface-subtle text-success-700 dark:bg-success-950/60 dark:text-success-300",
        warning:
          "border-warning-border/40 bg-warning-surface-subtle text-warning-700 dark:bg-warning-950/60 dark:text-warning-300",
        error:
          "border-error-border/40 bg-error-surface-subtle text-error-700 dark:bg-error-950/60 dark:text-error-300",
        info:
          "border-info-border/40 bg-info-surface-subtle text-info-700 dark:bg-info-950/60 dark:text-info-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
