import React from "react";
import { cn } from "../utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusClasses: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-success-surface",
  offline: "bg-grayscale-textIcon-caption",
  busy: "bg-error-surface",
};

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const initials =
    fallback ??
    alt
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-grayscale-border bg-primary-surface-subtle font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      {status && (
        <span
          aria-label={`Status: ${status}`}
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
}
