import type { GoldPurityRate, OhlcPoint } from "@/types/market";

/**
 * Derives 24K, 22K (91.6%), and 18K (75%) gold prices per gram and per 10g
 * from an authoritative 24K per-gram or per-10g quote.
 */
export function deriveGoldPurityRates(
  price24kPerGram: number,
  change24kPerGram: number,
  changePercent: number
): GoldPurityRate[] {
  const round2 = (n: number) => Math.round(n * 100) / 100;

  const p22 = round2(price24kPerGram * 0.916);
  const p18 = round2(price24kPerGram * 0.75);

  return [
    {
      purity: "24K",
      perGram: round2(price24kPerGram),
      per10Grams: round2(price24kPerGram * 10),
      changePerGram: round2(change24kPerGram),
      changePercent: round2(changePercent),
    },
    {
      purity: "22K",
      perGram: p22,
      per10Grams: round2(p22 * 10),
      changePerGram: round2(change24kPerGram * 0.916),
      changePercent: round2(changePercent),
    },
    {
      purity: "18K",
      perGram: p18,
      per10Grams: round2(p18 * 10),
      changePerGram: round2(change24kPerGram * 0.75),
      changePercent: round2(changePercent),
    },
  ];
}

/**
 * Computes normalized percentage return series starting at 0% from the first bar.
 */
export function normalizeReturnSeries(points: OhlcPoint[]): Array<{ time: string; returnPercent: number }> {
  if (points.length === 0) return [];
  const base = points[0].close || 1;
  return points.map((p) => ({
    time: p.time,
    returnPercent: Number((((p.close - base) / base) * 100).toFixed(2)),
  }));
}
