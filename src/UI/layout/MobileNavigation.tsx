"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import type { DashboardSection } from "../hooks/useDashboard";

export interface DashboardNavItem {
  id: DashboardSection;
  label: string;
  icon: React.ReactNode;
}

export interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  items: DashboardNavItem[];
  activeId: DashboardSection;
  onSelect: (id: DashboardSection) => void;
}

export function MobileNavigation({
  open,
  onClose,
  items,
  activeId,
  onSelect,
}: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="glass-panel relative z-10 flex h-full w-72 flex-col justify-between p-5"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  AstraAnalytics
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation drawer"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 dark:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav aria-label="Mobile dashboard navigation" className="flex flex-col gap-1">
                {items.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                        active
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/20 text-cyan-600 dark:text-cyan-300 border border-cyan-400/30"
                          : "text-slate-600 hover:bg-white/10 dark:text-slate-300"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
