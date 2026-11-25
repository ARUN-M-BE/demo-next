"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "../utils/cn";
import type { DashboardSection } from "../hooks/useDashboard";
import { MobileNavigation, type DashboardNavItem } from "./MobileNavigation";

export interface DashboardLayoutProps {
  items: DashboardNavItem[];
  activeSection: DashboardSection;
  onSelectSection: (id: DashboardSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Responsive Glassmorphism dashboard shell with collapsible sidebar and mobile drawer.
 */
export function DashboardLayout({
  items,
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onOpenMobile,
  onCloseMobile,
  headerContent,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="bg-analytics-canvas relative flex min-h-screen w-full overflow-x-clip">
      <MobileNavigation
        open={mobileOpen}
        onClose={onCloseMobile}
        items={items}
        activeId={activeSection}
        onSelect={onSelectSection}
      />

      {/* Desktop collapsible sidebar */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col justify-between border-r border-slate-200/70 bg-white/60 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#07111f]/80",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col gap-5 p-4">
          <div className="flex items-center justify-between px-1">
            {!collapsed && (
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                Analytics Suite
              </span>
            )}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white/70 text-slate-600 transition-colors hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <nav aria-label="Dashboard sections" className="flex flex-col gap-1.5">
            {items.map((item) => {
              const active = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="active-sidebar-pill"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-xl border border-cyan-400/35 bg-gradient-to-r from-blue-500/15 to-cyan-400/20"
                    />
                  )}
                  <span className="relative z-10 shrink-0 text-cyan-600 dark:text-cyan-400">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="relative z-10 truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="m-4 rounded-xl border border-slate-200/70 bg-white/60 p-3.5 text-xs dark:border-white/10 dark:bg-white/5">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Sample Analytics Mode
            </p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Filters &amp; exports operate on local mock datasets ready for API
              binding.
            </p>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200/70 bg-white/60 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/70 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onOpenMobile}
              aria-label="Open dashboard navigation"
              className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-700 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">{headerContent}</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
