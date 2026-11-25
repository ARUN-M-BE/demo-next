"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { cn } from "../utils/cn";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Navigation, type NavItem } from "./Navigation";

export interface HeaderProps {
  brandName?: string;
  navItems?: NavItem[];
  authSlot?: React.ReactNode;
  className?: string;
}

/**
 * Responsive top application header with mobile drawer, theme toggle, and auth slot.
 */
export function Header({
  brandName = "AstraStudio",
  navItems = [],
  authSlot,
  className,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-grayscale-border bg-background/85 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-semibold text-grayscale-textIcon-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-surface text-neutral-1150 shadow-elevation-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base tracking-tight">{brandName}</span>
          </Link>

          {navItems.length > 0 && (
            <div className="hidden md:block">
              <Suspense>
                <Navigation items={navItems} orientation="horizontal" />
              </Suspense>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {authSlot && <div className="hidden sm:flex items-center gap-2">{authSlot}</div>}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-grayscale-border bg-grayscale-surface-subtle text-grayscale-textIcon-title md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-grayscale-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              {navItems.length > 0 && (
                <Suspense>
                  <Navigation
                    items={navItems}
                    orientation="vertical"
                    onNavigate={() => setMobileOpen(false)}
                  />
                </Suspense>
              )}
              {authSlot && (
                <div className="flex items-center gap-2 border-t border-grayscale-border pt-3 sm:hidden">
                  {authSlot}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
