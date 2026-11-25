import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; icon: React.ReactNode }
> = {
  info: {
    container:
      "border-info-border bg-info-surface-subtle text-info-800 dark:bg-info-950/60 dark:text-info-200",
    icon: <Info className="h-4 w-4 shrink-0 text-info-500" />,
  },
  success: {
    container:
      "border-success-border bg-success-surface-subtle text-success-800 dark:bg-success-950/60 dark:text-success-200",
    icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />,
  },
  warning: {
    container:
      "border-warning-border bg-warning-surface-subtle text-warning-800 dark:bg-warning-950/60 dark:text-warning-200",
    icon: <AlertTriangle className="h-4 w-4 shrink-0 text-warning-500" />,
  },
  error: {
    container:
      "border-error-border bg-error-surface-subtle text-error-800 dark:bg-error-950/60 dark:text-error-200",
    icon: <AlertCircle className="h-4 w-4 shrink-0 text-error-500" />,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  onDismiss,
  className,
  children,
}: AlertProps) {
  const style = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-sm",
        style.container,
        className
      )}
    >
      <span className="mt-0.5">{style.icon}</span>
      <div className="flex-1">
        {title && <p className="font-semibold leading-snug">{title}</p>}
        {description && (
          <p className="mt-0.5 text-xs opacity-90">{description}</p>
        )}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
