import type {
  FeedStatus,
  MarketAssetId,
  OhlcPoint,
  TechnicalIndicatorsResult,
  Timeframe,
} from "@/types/market";

function calculateSMA(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  const sum = slice.reduce((acc, v) => acc + v, 0);
  return Number((sum / period).toFixed(2));
}

function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const firstSma =
    values.slice(0, period).reduce((acc, v) => acc + v, 0) / period;
  const emaSeries: number[] = [firstSma];

  for (let i = period; i < values.length; i++) {
    const prev = emaSeries[emaSeries.length - 1];
    emaSeries.push(values[i] * k + prev * (1 - k));
  }
  return emaSeries;
}

function calculateRSI(closes: number[], period = 14): number | null {
  if (closes.length <= period) return null;
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Number((100 - 100 / (1 + rs)).toFixed(2));
}

function calculateATR(points: OhlcPoint[], period = 14): number | null {
  if (points.length <= period) return null;
  const trs: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prevClose = points[i - 1].close;
    const tr = Math.max(
      curr.high - curr.low,
      Math.abs(curr.high - prevClose),
      Math.abs(curr.low - prevClose)
    );
    trs.push(tr);
  }
  const recent = trs.slice(-period);
  const atr = recent.reduce((acc, v) => acc + v, 0) / period;
  return Number(atr.toFixed(2));
}

/**
 * Computes institutional technical indicators strictly from real OHLC points.
 * Never fabricates values when insufficient data is present.
 */
export function computeTechnicalIndicators(
  asset: MarketAssetId,
  timeframe: Timeframe,
  points: OhlcPoint[],
  feedStatus: FeedStatus,
  message?: string
): TechnicalIndicatorsResult {
  const closes = points.map((p) => p.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);

  const ema20Series = calculateEMA(closes, 20);
  const ema20 =
    ema20Series.length > 0
      ? Number(ema20Series[ema20Series.length - 1].toFixed(2))
      : null;

  const rsi14 = calculateRSI(closes, 14);
  const atr14 = calculateATR(points, 14);

  // MACD (12, 26, 9)
  let macdLine: number | null = null;
  let signalLine: number | null = null;
  let histogram: number | null = null;
  if (closes.length >= 35) {
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const offset = ema12.length - ema26.length;
    const macdSeries = ema26.map((val, idx) => ema12[idx + offset] - val);
    const signalSeries = calculateEMA(macdSeries, 9);
    if (signalSeries.length > 0) {
      macdLine = Number(macdSeries[macdSeries.length - 1].toFixed(2));
      signalLine = Number(signalSeries[signalSeries.length - 1].toFixed(2));
      histogram = Number((macdLine - signalLine).toFixed(2));
    }
  }

  // Bollinger Bands (20, 2)
  let upper: number | null = null;
  let middle: number | null = null;
  let lower: number | null = null;
  if (closes.length >= 20 && sma20 !== null) {
    const slice = closes.slice(-20);
    const variance =
      slice.reduce((acc, v) => acc + Math.pow(v - sma20, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    middle = sma20;
    upper = Number((sma20 + 2 * stdDev).toFixed(2));
    lower = Number((sma20 - 2 * stdDev).toFixed(2));
  }

  const latestClose = closes[closes.length - 1];
  let trendDirection: TechnicalIndicatorsResult["trendDirection"] =
    "INSUFFICIENT_DATA";
  if (latestClose !== undefined && sma20 !== null) {
    if (latestClose > sma20 && (sma50 === null || sma20 >= sma50)) {
      trendDirection = "BULLISH";
    } else if (latestClose < sma20 && (sma50 === null || sma20 <= sma50)) {
      trendDirection = "BEARISH";
    } else {
      trendDirection = "NEUTRAL";
    }
  }

  let rsiCondition: TechnicalIndicatorsResult["rsiCondition"] =
    "INSUFFICIENT_DATA";
  if (rsi14 !== null) {
    if (rsi14 >= 70) rsiCondition = "OVERBOUGHT";
    else if (rsi14 <= 30) rsiCondition = "OVERSOLD";
    else rsiCondition = "NEUTRAL";
  }

  // Rolling 10-bar volatility & peak-to-trough drawdown
  const volatilitySeries: Array<{ time: string; volatility: number }> = [];
  const drawdownSeries: Array<{ time: string; drawdown: number }> = [];
  let runningPeak = points[0]?.high ?? 0;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (pt.high > runningPeak) runningPeak = pt.high;
    const dd =
      runningPeak > 0 ? ((pt.close - runningPeak) / runningPeak) * 100 : 0;
    drawdownSeries.push({ time: pt.time, drawdown: Number(dd.toFixed(2)) });

    if (i >= 10) {
      const window = closes.slice(i - 10, i + 1);
      const mean = window.reduce((a, b) => a + b, 0) / window.length;
      const std = Math.sqrt(
        window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length
      );
      const volPct = mean > 0 ? (std / mean) * 100 : 0;
      volatilitySeries.push({
        time: pt.time,
        volatility: Number(volPct.toFixed(2)),
      });
    }
  }

  return {
    asset,
    timeframe,
    dataPointsUsed: points.length,
    sma20,
    sma50,
    sma200,
    ema20,
    rsi14,
    macd: { macdLine, signalLine, histogram },
    bollingerBands: { upper, middle, lower },
    atr14,
    trendDirection,
    rsiCondition,
    volatilitySeries,
    drawdownSeries,
    feedStatus,
    message,
  };
}
