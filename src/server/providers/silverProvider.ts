import type { SilverMarketData } from "@/types/market";
import { getCached, setCached } from "../services/cacheService";

/**
 * Adapter for Indian Silver Prices (1g, 10g, 100g, 1kg).
 * Requires server-side METALS_API_KEY.
 */
export async function fetchSilverMarketData(cityParam?: string): Promise<SilverMarketData> {
  const apiKey = process.env.METALS_API_KEY?.trim();
  const baseUrl =
    process.env.METALS_API_BASE_URL?.trim() || "https://metals.nebulaapi.com/v1";
  const providerName = process.env.SILVER_API_PROVIDER?.trim() || "nebula";
  const city = cityParam?.trim() || process.env.DEFAULT_CITY?.trim() || "Madurai";
  const ttlMs = Number(process.env.MARKET_DATA_REFRESH_INTERVAL || 60000);
  const cacheKey = `silver_rates_${city.toLowerCase()}`;

  if (!apiKey) {
    return {
      city,
      currency: "INR",
      rateType: "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel: "City Retail Indicative Rate (Provider Unconfigured)",
      perGram: null,
      per10Grams: null,
      per100Grams: null,
      perKg: null,
      changePerGram: null,
      changePercent: null,
      dayHighPerKg: null,
      dayLowPerKg: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: null,
      feedStatus: "UNCONFIGURED",
      provider: `Precious Metals API (${providerName})`,
      missingEnv: ["METALS_API_KEY"],
      message:
        "Configure METALS_API_KEY in .env.local to fetch live Indian silver rates.",
    };
  }

  const cached = getCached<SilverMarketData>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const url = `${baseUrl.replace(/\/$/, "")}/silver?city=${encodeURIComponent(city)}&currency=INR`;
    const res = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (res.status === 429 && cached) {
      return {
        ...cached.value,
        feedStatus: "STALE",
        message: "Rate limited by metals provider; showing cached silver rate.",
      };
    }

    if (!res.ok) {
      throw new Error(`Silver provider responded with HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      price_per_gram?: number;
      change_per_gram?: number;
      change_percent?: number;
      day_high_per_kg?: number;
      day_low_per_kg?: number;
      updated_at?: string;
    };

    if (typeof json.price_per_gram !== "number") {
      throw new Error("Unexpected response schema from silver provider");
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;
    const perGram = round2(json.price_per_gram);

    const data: SilverMarketData = {
      city,
      currency: "INR",
      rateType:
        providerName === "ibja" ? "BULLION_BENCHMARK" : "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel:
        providerName === "ibja"
          ? "IBJA Bullion Benchmark"
          : `Retail Indicative Rate (${city})`,
      perGram,
      per10Grams: round2(perGram * 10),
      per100Grams: round2(perGram * 100),
      perKg: round2(perGram * 1000),
      changePerGram: json.change_per_gram ?? null,
      changePercent: json.change_percent ?? null,
      dayHighPerKg: json.day_high_per_kg ?? null,
      dayLowPerKg: json.day_low_per_kg ?? null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: json.updated_at ?? new Date().toISOString(),
      feedStatus: providerName === "ibja" ? "DAILY_BENCHMARK" : "DELAYED",
      provider: providerName.toUpperCase(),
    };

    setCached(cacheKey, data, ttlMs);
    return data;
  } catch (err) {
    if (cached) {
      return {
        ...cached.value,
        feedStatus: "STALE",
        message: `Silver feed error (${err instanceof Error ? err.message : "Unknown"}). Showing cached rate.`,
      };
    }

    return {
      city,
      currency: "INR",
      rateType: "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel: `Retail Indicative Rate (${city})`,
      perGram: null,
      per10Grams: null,
      per100Grams: null,
      perKg: null,
      changePerGram: null,
      changePercent: null,
      dayHighPerKg: null,
      dayLowPerKg: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: null,
      feedStatus: "ERROR",
      provider: providerName.toUpperCase(),
      message: err instanceof Error ? err.message : "Failed to fetch silver rates.",
    };
  }
}
