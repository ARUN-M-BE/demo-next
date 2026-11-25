"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Coins,
  Compass,
  GitCompare,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  ComparisonSection,
  GlassButton,
  GoldSection,
  MarketOverview,
  MarketStatus,
  PriceAlerts,
  SearchBar,
  SensexSection,
  SilverSection,
  TechnicalAnalysis,
  ThemeToggle,
  useToast,
} from "@/UI";
import { useMarketStore, type MarketTerminalSection } from "@/store/marketStore";
import { MarketBackground } from "./MarketBackground";

const TERMINAL_TABS: Array<{
  id: MarketTerminalSection;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "overview", label: "Overview", icon: <Compass className="h-4 w-4" /> },
  { id: "sensex", label: "BSE SENSEX", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "gold", label: "Gold (24K/22K/18K)", icon: <Coins className="h-4 w-4" /> },
  { id: "silver", label: "Silver", icon: <Activity className="h-4 w-4" /> },
  { id: "comparison", label: "Comparison", icon: <GitCompare className="h-4 w-4" /> },
  { id: "indicators", label: "Technical Analysis", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "alerts", label: "Price Alerts", icon: <Bell className="h-4 w-4" /> },
];

export interface MarketTerminalProps {
  userName?: string | null;
}

export function MarketTerminal({ userName }: MarketTerminalProps) {
  const {
    activeSection,
    setActiveSection,
    searchQuery,
    setSearchQuery,
    marketStatus,
    isLoading,
    lastRefreshIso,
    fetchOverview,
  } = useMarketStore();

  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void fetchOverview();
    const timer = setInterval(() => {
      void fetchOverview();
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchOverview]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchOverview();
    setRefreshing(false);
    toast({
      type: "info",
      title: "Market Feed Refreshed",
      description: "Polled latest provider status from server.",
    });
  };

  const filteredTabs = searchQuery.trim()
    ? TERMINAL_TABS.filter((t) =>
        t.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TERMINAL_TABS;

  return (
    <div className="bg-analytics-canvas relative min-h-[calc(100vh-8rem)] w-full overflow-x-clip">
      <MarketBackground />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Terminal Top Control Bar */}
        <div className="glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  MARKET INTELLIGENCE TERMINAL
                </h1>
                <MarketStatus info={marketStatus} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {userName ? `Analyst: ${userName} • ` : ""}
                {lastRefreshIso
                  ? `Last polled: ${new Date(lastRefreshIso).toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })} IST`
                  : "Initializing market feeds..."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter sections (SENSEX, Gold, Silver...)"
                className="w-full sm:w-60"
              />
              <GlassButton
                size="sm"
                onClick={() => void handleManualRefresh()}
                leftIcon={
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      refreshing || isLoading ? "animate-spin" : ""
                    }`}
                  />
                }
              >
                Refresh
              </GlassButton>
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Section Navigation */}
          <nav
            aria-label="Market Intelligence sections"
            className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/60 pt-3 dark:border-white/10"
          >
            {filteredTabs.map((tab) => {
              const active = tab.id === activeSection;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-elevation-xs"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Section Content */}
        {activeSection === "overview" && (
          <div className="flex flex-col gap-8">
            <MarketOverview />
            <SensexSection />
            <GoldSection />
            <SilverSection />
          </div>
        )}
        {activeSection === "sensex" && <SensexSection />}
        {activeSection === "gold" && <GoldSection />}
        {activeSection === "silver" && <SilverSection />}
        {activeSection === "comparison" && <ComparisonSection />}
        {activeSection === "indicators" && <TechnicalAnalysis />}
        {activeSection === "alerts" && <PriceAlerts />}
      </div>
    </div>
  );
}
