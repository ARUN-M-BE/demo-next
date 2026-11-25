"use client";

import { create } from "zustand";
import type {
  GoldMarketData,
  MarketAlert,
  MarketStatusInfo,
  SensexQuote,
  SilverMarketData,
  Timeframe,
} from "@/types/market";

export type MarketTerminalSection =
  | "overview"
  | "sensex"
  | "gold"
  | "silver"
  | "comparison"
  | "indicators"
  | "alerts";

interface MarketState {
  activeSection: MarketTerminalSection;
  city: string;
  timeframe: Timeframe;
  searchQuery: string;
  isLoading: boolean;
  lastRefreshIso: string | null;
  marketStatus: MarketStatusInfo | null;
  sensex: SensexQuote | null;
  gold: GoldMarketData | null;
  silver: SilverMarketData | null;
  alerts: MarketAlert[];
  watchlistAllocation: Array<{ name: string; weight: number; color: string }>;
  setActiveSection: (section: MarketTerminalSection) => void;
  setCity: (city: string) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setSearchQuery: (q: string) => void;
  fetchOverview: (city?: string) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  setWatchlistAllocation: (
    next: Array<{ name: string; weight: number; color: string }>
  ) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  activeSection: "overview",
  city: "Madurai",
  timeframe: "1M",
  searchQuery: "",
  isLoading: true,
  lastRefreshIso: null,
  marketStatus: null,
  sensex: null,
  gold: null,
  silver: null,
  alerts: [],
  watchlistAllocation: [
    { name: "BSE SENSEX", weight: 50, color: "#22D3EE" },
    { name: "24K Gold", weight: 30, color: "#F59E0B" },
    { name: "Silver", weight: 20, color: "#94A3B8" },
  ],
  setActiveSection: (activeSection) => set({ activeSection }),
  setCity: (city) => {
    set({ city });
    void get().fetchOverview(city);
  },
  setTimeframe: (timeframe) => set({ timeframe }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setWatchlistAllocation: (watchlistAllocation) => set({ watchlistAllocation }),

  fetchOverview: async (cityOverride) => {
    const city = cityOverride ?? get().city;
    set({ isLoading: true });
    try {
      const res = await fetch(
        `/api/market/overview?city=${encodeURIComponent(city)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch market overview");
      const data = (await res.json()) as {
        marketStatus: MarketStatusInfo;
        sensex: SensexQuote;
        gold: GoldMarketData;
        silver: SilverMarketData;
        serverTimestamp: string;
      };
      set({
        marketStatus: data.marketStatus,
        sensex: data.sensex,
        gold: data.gold,
        silver: data.silver,
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
