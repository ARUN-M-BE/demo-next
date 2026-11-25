import type { GoldMarketData } from "@/types/market";
import { getCached, setCached } from "../services/cacheService";
import { deriveGoldPurityRates } from "../services/priceCalculationService";

/**
 * Adapter for Indian Gold Prices (24K, 22K, 18K) via Nebula Metals API / IBJA / MJDTA.
 * Requires server-side METALS_API_KEY.
 */
export async function fetchGoldMarketData(cityParam?: string): Promise<GoldMarketData> {
  const apiKey = process.env.METALS_API_KEY?.trim();
  const baseUrl =
    process.env.METALS_API_BASE_URL?.trim() || "https://metals.nebulaapi.com/v1";
  const providerName = process.env.GOLD_API_PROVIDER?.trim() || "nebula";
  const city = cityParam?.trim() || process.env.DEFAULT_CITY?.trim() || "Madurai";
  const ttlMs = Number(process.env.MARKET_DATA_REFRESH_INTERVAL || 60000);
  const cacheKey = `gold_rates_${city.toLowerCase()}`;

  if (!apiKey) {
    return {
      city,
      currency: "INR",
      rateType: "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel: "City Retail Indicative Rate (Provider Unconfigured)",
      rates: [
        { purity: "24K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
        { purity: "22K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
        { purity: "18K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
      ],
      dayHigh24k: null,
      dayLow24k: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: null,
      feedStatus: "UNCONFIGURED",
      provider: `Precious Metals API (${providerName})`,
      missingEnv: ["METALS_API_KEY"],
      message:
        "Configure METALS_API_KEY in .env.local to fetch live Indian gold rates.",
    };
  }

  const cached = getCached<GoldMarketData>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const url = `${baseUrl.replace(/\/$/, "")}/gold?city=${encodeURIComponent(city)}&currency=INR`;
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
        message: "Rate limited by metals provider; showing last cached rate.",
      };
    }

    if (!res.ok) {
      throw new Error(`Metals provider responded with HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      price_24k_per_gram?: number;
      change_per_gram?: number;
      change_percent?: number;
      day_high?: number;
      day_low?: number;
      updated_at?: string;
    };

    if (typeof json.price_24k_per_gram !== "number") {
      throw new Error("Unexpected response schema from gold provider");
    }

    const changePerGram = json.change_per_gram ?? 0;
    const changePercent = json.change_percent ?? 0;

    const data: GoldMarketData = {
      city,
      currency: "INR",
      rateType:
        providerName === "ibja" ? "BULLION_BENCHMARK" : "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel:
        providerName === "ibja"
          ? "IBJA Bullion Benchmark"
          : `Retail Indicative Rate (${city})`,
      rates: deriveGoldPurityRates(
        json.price_24k_per_gram,
        changePerGram,
        changePercent
      ),
      dayHigh24k: json.day_high ?? null,
      dayLow24k: json.day_low ?? null,
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
        message: `Metals feed error (${err instanceof Error ? err.message : "Unknown"}). Showing cached rate.`,
      };
    }

    return {
      city,
      currency: "INR",
      rateType: "RETAIL_INDICATIVE_PRICE",
      rateTypeLabel: `Retail Indicative Rate (${city})`,
      rates: [
        { purity: "24K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
        { purity: "22K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
        { purity: "18K", perGram: null, per10Grams: null, changePerGram: null, changePercent: null },
      ],
      dayHigh24k: null,
      dayLow24k: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: null,
      feedStatus: "ERROR",
      provider: providerName.toUpperCase(),
      message: err instanceof Error ? err.message : "Failed to fetch gold rates.",
    };
  }
}
