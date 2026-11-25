export type FeedStatus =
  | "LIVE"
  | "DELAYED"
  | "DAILY_BENCHMARK"
  | "STALE"
  | "PREVIOUS_CLOSE"
  | "UNCONFIGURED"
  | "ERROR";

export type RateType =
  | "EXCHANGE_MARKET_PRICE"
  | "BULLION_BENCHMARK"
  | "RETAIL_INDICATIVE_PRICE"
  | "INTERNATIONAL_SPOT_PRICE";

export type MarketSessionStatus = "MARKET OPEN" | "PRE-OPEN" | "MARKET CLOSED";

export type Timeframe = "1D" | "5D" | "1M" | "3M" | "6M" | "1Y" | "5Y";

export type MarketAssetId = "GOLD_24K" | "GOLD_22K" | "GOLD_18K" | "SILVER";

export interface OhlcPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface GoldPurityRate {
  purity: "24K" | "22K" | "18K";
  perGram: number | null;
  per10Grams: number | null;
  changePerGram: number | null;
  changePercent: number | null;
}

export interface GoldMarketData {
  city: string;
  currency: "INR";
  rateType: RateType;
  rateTypeLabel: string;
  rates: GoldPurityRate[];
  dayHigh24k: number | null;
  dayLow24k: number | null;
  weeklyChangePercent: number | null;
  monthlyChangePercent: number | null;
  yearlyChangePercent: number | null;
  volatilityPercent: number | null;
  timestamp: string | null;
  feedStatus: FeedStatus;
  provider: string;
  message?: string;
  missingEnv?: string[];
}

export interface SilverMarketData {
  city: string;
  currency: "INR";
  rateType: RateType;
  rateTypeLabel: string;
  perGram: number | null;
  per10Grams: number | null;
  per100Grams: number | null;
  perKg: number | null;
  changePerGram: number | null;
  changePercent: number | null;
  dayHighPerKg: number | null;
  dayLowPerKg: number | null;
  weeklyChangePercent: number | null;
  monthlyChangePercent: number | null;
  yearlyChangePercent: number | null;
  volatilityPercent: number | null;
  timestamp: string | null;
  feedStatus: FeedStatus;
  provider: string;
  message?: string;
  missingEnv?: string[];
}

export interface SpotMarketData {
  currency: "INR";
  unit: "gram";
  goldSpotPerGram: number | null;
  goldSpotUsdOz: number | null;
  silverSpotPerGram: number | null;
  silverSpotUsdOz: number | null;
  fxRateUsdInr: number | null;
  goldSilverRatio: number | null;
  isStale: boolean;
  ageSeconds: number | null;
  timestamp: string | null;
  feedStatus: FeedStatus;
  source: string;
  rateTypeLabel: "International Indicative Spot Rate";
  message?: string;
}

export interface HistoricalSeriesResponse {
  asset: MarketAssetId;
  timeframe: Timeframe;
  interval: string;
  currency: "INR";
  points: OhlcPoint[];
  feedStatus: FeedStatus;
  provider: string;
  lastUpdated: string | null;
  message?: string;
  missingEnv?: string[];
}

export interface TechnicalIndicatorsResult {
  asset: MarketAssetId;
  timeframe: Timeframe;
  dataPointsUsed: number;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  ema20: number | null;
  rsi14: number | null;
  macd: {
    macdLine: number | null;
    signalLine: number | null;
    histogram: number | null;
  };
  bollingerBands: {
    upper: number | null;
    middle: number | null;
    lower: number | null;
  };
  atr14: number | null;
  trendDirection: "BULLISH" | "BEARISH" | "NEUTRAL" | "INSUFFICIENT_DATA";
  rsiCondition: "OVERBOUGHT" | "OVERSOLD" | "NEUTRAL" | "INSUFFICIENT_DATA";
  volatilitySeries: Array<{ time: string; volatility: number }>;
  drawdownSeries: Array<{ time: string; drawdown: number }>;
  feedStatus: FeedStatus;
  message?: string;
}

export interface MarketStatusInfo {
  status: MarketSessionStatus;
  istTime: string;
  istDate: string;
  reason: string;
  nextSessionNote: string;
}

export interface MarketAlert {
  id: string;
  asset: MarketAssetId;
  condition: "ABOVE" | "BELOW" | "PERCENT_CHANGE";
  targetValue: number;
  unit: string;
  enabled: boolean;
  createdAt: string;
  triggeredAt: string | null;
  storageMode: "SERVER_MEMORY" | "BROWSER_LOCAL";
}
