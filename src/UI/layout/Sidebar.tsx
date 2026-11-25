"use client";

import React, { Suspense } from "react";
import { cn } from "../utils/cn";
import { Navigation, type NavItem } from "./Navigation";

export interface SidebarProps {
  items: NavItem[];
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({ items, title, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-grayscale-border bg-grayscale-surface-subtle/60 p-4",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {title && (
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-grayscale-textIcon-caption">
            {title}
          </p>
        )}
        <Suspense>
          <Navigation items={items} orientation="vertical" />
        </Suspense>
      </div>
      {footer && (
        <div className="border-t border-grayscale-border pt-4">{footer}</div>
      )}
    </aside>
  );
}
