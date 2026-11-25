import type { CountryMarkerData } from "@/UI/maps/MapTooltip";
import type { DateRangePreset } from "@/lib/constants";

export type AnalyticsChannel =
  | "all"
  | "Organic"
  | "Direct"
  | "Social"
  | "Referral"
  | "Paid";

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  sparkline: number[];
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
  accentColor: string;
  invertTrend?: boolean;
}

export interface TimeSeriesPoint {
  date: string;
  visitors: number;
  sessions: number;
  previousVisitors: number;
  revenue: number;
  channel: Exclude<AnalyticsChannel, "all">;
}

export interface CategoryMetric {
  name: string;
  value: number;
  previousValue: number;
  color: string;
}

export interface FunnelItem {
  stage: string;
  count: number;
  color: string;
}

export interface RadarItem {
  metric: string;
  current: number;
  benchmark: number;
}

export interface AnalyticsFilterState {
  dateRange: DateRangePreset;
  customStart: string;
  customEnd: string;
  channel: AnalyticsChannel;
  countryId: string | null;
  searchQuery: string;
  comparePrevious: boolean;
}

export type CountryStats = CountryMarkerData;
