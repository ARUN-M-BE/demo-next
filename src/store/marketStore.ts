"use client";

import { create } from "zustand";
import type {
  GoldMarketData,
  MarketAlert,
  MarketStatusInfo,
  SilverMarketData,
  SpotMarketData,
  Timeframe,
} from "@/types/market";

export type MarketTerminalSection =
  | "overview"
  | "gold"
  | "silver"
  | "comparison"
  | "indicators"
  | "alerts";

interface MarketState {
  activeSection: MarketTerminalSection;
  timeframe: Timeframe;
  searchQuery: string;
  isLoading: boolean;
  lastRefreshIso: string | null;
  marketStatus: MarketStatusInfo | null;
  gold: GoldMarketData | null;
  silver: SilverMarketData | null;
  spot: SpotMarketData | null;
  alerts: MarketAlert[];
  watchlistAllocation: Array<{ name: string; weight: number; color: string }>;
  setActiveSection: (section: MarketTerminalSection) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setSearchQuery: (q: string) => void;
  hydrateOverview: (data: {
    marketStatus: MarketStatusInfo;
    gold: GoldMarketData;
    silver: SilverMarketData;
    spot: SpotMarketData;
    serverTimestamp: string;
  }) => void;
  fetchOverview: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set) => ({
  activeSection: "overview",
  timeframe: "1M",
  searchQuery: "",
  isLoading: true,
  lastRefreshIso: null,
  marketStatus: null,
  gold: null,
  silver: null,
  spot: null,
  alerts: [],
  watchlistAllocation: [
    { name: "24K Gold", weight: 50, color: "#F59E0B" },
    { name: "22K Gold", weight: 30, color: "#22D3EE" },
    { name: "Silver", weight: 20, color: "#94A3B8" },
  ],
  setActiveSection: (activeSection) => set({ activeSection }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  hydrateOverview: (data) =>
    set({
      marketStatus: data.marketStatus,
      gold: data.gold,
      silver: data.silver,
      spot: data.spot,
      lastRefreshIso: data.serverTimestamp,
      isLoading: false,
    }),

  fetchOverview: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/market/overview", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch market overview");
      const data = (await res.json()) as {
        marketStatus: MarketStatusInfo;
        gold: GoldMarketData;
        silver: SilverMarketData;
        spot: SpotMarketData;
        serverTimestamp: string;
      };
      set({
        marketStatus: data.marketStatus,
        gold: data.gold,
        silver: data.silver,
        spot: data.spot,
        lastRefreshIso: data.serverTimestamp,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchAlerts: async () => {
    try {
      const res = await fetch("/api/alerts", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { alerts: MarketAlert[] };
      set({ alerts: data.alerts ?? [] });
    } catch {
      // Ignore fetch errors
    }
  },
}));
