"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/cn";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

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
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300"
                : "text-slate-600 hover:bg-white/10 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
