import type { FeedStatus } from "@/types/market";

export interface FreshnessMeta {
  label: string;
  ageSeconds: number | null;
  isStale: boolean;
}

/**
 * Evaluates data freshness from provider timestamp and feed type.
 */
export function evaluateDataFreshness(
  timestamp: string | null,
  feedStatus: FeedStatus,
  maxFreshSeconds = 300
): FreshnessMeta {
  if (!timestamp) {
    return {
      label: feedStatus === "ERROR" ? "ERROR" : "UNAVAILABLE",
      ageSeconds: null,
      isStale: true,
    };
  }

  const ts = Date.parse(timestamp);
  const ageSeconds = Number.isNaN(ts)
    ? null
    : Math.max(0, Math.floor((Date.now() - ts) / 1000));

  if (feedStatus === "DAILY_BENCHMARK") {
    return { label: "DAILY BENCHMARK", ageSeconds, isStale: false };
  }

  if (ageSeconds !== null && ageSeconds > maxFreshSeconds) {
    return { label: "STALE", ageSeconds, isStale: true };
  }

  return {
    label: feedStatus.replace("_", " "),
    ageSeconds,
    isStale: feedStatus === "STALE",
  };
}
