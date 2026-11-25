"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { cn } from "../utils/cn";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Navigation, type NavItem } from "./Navigation";

export interface HeaderProps {
  brandName?: string;
  navItems?: NavItem[];
  authSlot?: React.ReactNode;
  className?: string;
}

export function Header({
  brandName = "MARKET INTELLIGENCE",
  navItems = [],
  authSlot,
  className,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111F]/85",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-elevation-xs">
              <Activity className="h-4 w-4" />
            </span>
            <span className="text-sm sm:text-base">{brandName}</span>
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
          <ThemeToggle size="sm" />
          {authSlot && (
            <div className="hidden sm:flex items-center gap-2">{authSlot}</div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-800 md:hidden dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200/70 bg-white/95 md:hidden dark:border-white/10 dark:bg-[#07111F]"
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
                <div className="flex items-center gap-2 border-t border-white/10 pt-3 sm:hidden">
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
