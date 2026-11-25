import type { SpotMarketData } from "@/types/market";
import { getCached, setCached } from "@/server/services/cacheService";

const XAUS_URL = "https://xaus.com/api/v1/spot?currency=INR&unit=gram";
const CACHE_TTL_MS = 60_000; // Respect provider cache interval (>= 60s)
const TROY_OZ_TO_GRAMS = 31.1034768;

interface XausSpotResponse {
  xau?: { price: number; currency: string; unit: string };
  spot_usd_oz?: number;
  silver_usd_oz?: number;
  fx_rate?: number;
  gold_silver_ratio?: number;
  stale?: boolean;
  data_state?: { status?: string; as_of?: string; age_seconds?: number };
  price_as_of?: string;
  updated_at?: string;
  price_source?: string;
  source?: string;
}

/**
 * Fetches international indicative spot rates in INR from XAUS (xaus.com/api).
 */
export async function fetchXausSpotRates(): Promise<SpotMarketData> {
  const cacheKey = "xaus_spot_inr_gram";
  const cached = getCached<SpotMarketData>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const res = await fetch(XAUS_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`XAUS API HTTP ${res.status}`);
    }

    const json = (await res.json()) as XausSpotResponse;
    const goldPerGram = json.xau?.price ?? null;
    const silverUsdOz = json.silver_usd_oz ?? null;
    const fxRate = json.fx_rate ?? null;

    const silverPerGram =
      silverUsdOz !== null && fxRate !== null
        ? Number(((silverUsdOz * fxRate) / TROY_OZ_TO_GRAMS).toFixed(2))
        : null;

    const isStale = Boolean(json.stale) || json.data_state?.status === "stale";

    const data: SpotMarketData = {
      currency: "INR",
      unit: "gram",
      goldSpotPerGram: goldPerGram !== null ? Number(goldPerGram.toFixed(2)) : null,
      goldSpotUsdOz: json.spot_usd_oz ?? null,
      silverSpotPerGram: silverPerGram,
      silverSpotUsdOz: silverUsdOz,
      fxRateUsdInr: fxRate,
      goldSilverRatio: json.gold_silver_ratio ?? null,
      isStale,
      ageSeconds: json.data_state?.age_seconds ?? null,
      timestamp: json.price_as_of ?? json.updated_at ?? null,
      feedStatus: isStale ? "STALE" : "DELAYED",
      source: `XAUS (${json.price_source ?? json.source ?? "xaus.com"})`,
      rateTypeLabel: "International Indicative Spot Rate",
    };

    setCached(cacheKey, data, CACHE_TTL_MS);
    return data;
  } catch (err) {
    if (cached) {
      return {
        ...cached.value,
        feedStatus: "STALE",
        isStale: true,
        message: `XAUS feed interrupted (${err instanceof Error ? err.message : "Unknown"}).`,
      };
    }

    return {
      currency: "INR",
      unit: "gram",
      goldSpotPerGram: null,
      goldSpotUsdOz: null,
      silverSpotPerGram: null,
      silverSpotUsdOz: null,
      fxRateUsdInr: null,
      goldSilverRatio: null,
      isStale: false,
      ageSeconds: null,
      timestamp: null,
      feedStatus: "ERROR",
      source: "XAUS (xaus.com)",
      rateTypeLabel: "International Indicative Spot Rate",
      message: err instanceof Error ? err.message : "Failed to fetch XAUS spot rates.",
    };
  }
}
