import type { GoldMarketData, OhlcPoint, SilverMarketData } from "@/types/market";
import { getCached, setCached } from "@/server/services/cacheService";

const BASE_URL = "https://api.dharun.dev";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes for IBJA daily benchmark

interface BullionRateItem {
  metal: "gold" | "silver" | "platinum";
  purity: string;
  karat?: string;
  session: "AM" | "PM";
  rupees: number;
  unit: string;
  perGram: number;
  change: number;
  previousDate: string;
}

interface BullionTodayResponse {
  data?: {
    date: string;
    rates: BullionRateItem[];
  };
  meta?: {
    source?: { name?: string; url?: string };
  };
}

interface BullionHistoryResponse {
  data?: {
    metal: string;
    purity?: string;
    unit: string;
    rates: Array<{
      date: string;
      session: string;
      rupees: number;
      perGram: number;
    }>;
  };
}

async function fetchTodayBullionRaw(): Promise<BullionTodayResponse> {
  const cacheKey = "india_bullion_today";
  const cached = getCached<BullionTodayResponse>(cacheKey);
  if (cached && !cached.isStale) return cached.value;

  const res = await fetch(`${BASE_URL}/v1/bullion`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`India Bullion API HTTP ${res.status}`);
  }

  const json = (await res.json()) as BullionTodayResponse;
  setCached(cacheKey, json, CACHE_TTL_MS);
  return json;
}

/**
 * Fetches IBJA Indian Gold benchmark rates (24K, 22K, 18K) from api.dharun.dev.
 */
export async function fetchIndiaGoldBenchmark(): Promise<GoldMarketData> {
  try {
    const json = await fetchTodayBullionRaw();
    const rates = json.data?.rates ?? [];
    const date = json.data?.date ?? null;

    const findPurity = (purity: string, karat: "24K" | "22K" | "18K") => {
      const item = rates.find((r) => r.metal === "gold" && r.purity === purity);
      if (!item) {
        return {
          purity: karat,
          perGram: null,
          per10Grams: null,
          changePerGram: null,
          changePercent: null,
        };
      }
      const changePerGram = Number((item.change / 10).toFixed(2));
      const prev10g = item.rupees - item.change;
      const changePercent =
        prev10g > 0 ? Number(((item.change / prev10g) * 100).toFixed(2)) : null;

      return {
        purity: karat,
        perGram: item.perGram,
        per10Grams: item.rupees,
        changePerGram,
        changePercent,
      };
    };

    const sourceName = json.meta?.source?.name ?? "IBJA (api.dharun.dev)";

    return {
      city: "India (IBJA Benchmark)",
      currency: "INR",
      rateType: "BULLION_BENCHMARK",
      rateTypeLabel: `IBJA Bullion Benchmark (${rates[0]?.session ?? "PM"} Session)`,
      rates: [
        findPurity("999", "24K"),
        findPurity("916", "22K"),
        findPurity("750", "18K"),
      ],
      dayHigh24k: null,
      dayLow24k: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: date ? `${date}T12:00:00+05:30` : null,
      feedStatus: "DAILY_BENCHMARK",
      provider: sourceName,
    };
  } catch (err) {
    return {
      city: "India (IBJA Benchmark)",
      currency: "INR",
      rateType: "BULLION_BENCHMARK",
      rateTypeLabel: "IBJA Bullion Benchmark",
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
      provider: "IBJA (api.dharun.dev)",
      message: err instanceof Error ? err.message : "Failed to fetch IBJA gold benchmark.",
    };
  }
}

/**
 * Fetches IBJA Indian Silver benchmark rate (per gram & per kg) from api.dharun.dev.
 */
export async function fetchIndiaSilverBenchmark(): Promise<SilverMarketData> {
  try {
    const json = await fetchTodayBullionRaw();
    const rates = json.data?.rates ?? [];
    const date = json.data?.date ?? null;
    const silver = rates.find((r) => r.metal === "silver");

    if (!silver) {
      throw new Error("Silver rate missing in India Bullion response");
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;
    const perGram = silver.perGram;
    const perKg = silver.rupees;
    const changePerGram = round2(silver.change / 1000);
    const prevKg = perKg - silver.change;
    const changePercent =
      prevKg > 0 ? round2((silver.change / prevKg) * 100) : null;

    return {
      city: "India (IBJA Benchmark)",
      currency: "INR",
      rateType: "BULLION_BENCHMARK",
      rateTypeLabel: `IBJA Bullion Benchmark (${silver.session} Session)`,
      perGram,
      per10Grams: round2(perGram * 10),
      per100Grams: round2(perGram * 100),
      perKg,
      changePerGram,
      changePercent,
      dayHighPerKg: null,
      dayLowPerKg: null,
      weeklyChangePercent: null,
      monthlyChangePercent: null,
      yearlyChangePercent: null,
      volatilityPercent: null,
      timestamp: date ? `${date}T12:00:00+05:30` : null,
      feedStatus: "DAILY_BENCHMARK",
      provider: json.meta?.source?.name ?? "IBJA (api.dharun.dev)",
    };
  } catch (err) {
    return {
      city: "India (IBJA Benchmark)",
      currency: "INR",
      rateType: "BULLION_BENCHMARK",
      rateTypeLabel: "IBJA Bullion Benchmark",
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
      provider: "IBJA (api.dharun.dev)",
      message: err instanceof Error ? err.message : "Failed to fetch IBJA silver benchmark.",
    };
  }
}

/**
 * Fetches historical IBJA bullion prices and aggregates AM/PM sessions per date into OHLC points.
 */
export async function fetchIndiaBullionHistory(
  metal: "gold" | "silver",
  purity: "999" | "916" | "750" | undefined,
  days: number
): Promise<OhlcPoint[]> {
  const cacheKey = `india_bullion_hist_${metal}_${purity ?? "all"}_${days}`;
  const cached = getCached<OhlcPoint[]>(cacheKey);
  if (cached && !cached.isStale) return cached.value;

  const params = new URLSearchParams({
    metal,
    days: String(days),
  });
  if (metal === "gold" && purity) {
    params.set("purity", purity);
  }

  const res = await fetch(`${BASE_URL}/v1/bullion/history?${params.toString()}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Bullion history HTTP ${res.status}`);
  }

  const json = (await res.json()) as BullionHistoryResponse;
  const rows = json.data?.rates ?? [];

  // Group AM/PM sessions by date to build clean daily OHLC bars
  const byDate = new Map<string, number[]>();
  for (const r of rows) {
    const val = r.perGram;
    const list = byDate.get(r.date) ?? [];
    list.push(val);
    byDate.set(r.date, list);
  }

  const points: OhlcPoint[] = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      time: date,
      open: vals[0],
      high: Math.max(...vals),
      low: Math.min(...vals),
      close: vals[vals.length - 1],
    }));

  setCached(cacheKey, points, CACHE_TTL_MS);
  return points;
}
