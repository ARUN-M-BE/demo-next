"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/cn";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

/**
 * Responsive navigation link list with active route highlighting.
 */
export function Navigation({
  items,
  orientation = "horizontal",
  onNavigate,
  className,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-center gap-1"
          : "flex-col gap-1",
        className
      )}
    >
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              isActive
                ? "bg-primary-surface-subtle text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                : "text-grayscale-textIcon-subtitle hover:bg-grayscale-surface-hover hover:text-grayscale-textIcon-title"
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
