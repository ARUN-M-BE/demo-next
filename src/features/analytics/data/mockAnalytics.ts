import { ANALYTICS_ACCENT_COLORS, type DateRangePreset } from "@/lib/constants";
import type {
  AnalyticsChannel,
  CategoryMetric,
  CountryStats,
  FunnelItem,
  KpiMetric,
  RadarItem,
  TimeSeriesPoint,
} from "../types/analytics";

/**
 * Sample web analytics country dataset (mock data for UI development).
 */
export const MOCK_COUNTRIES: CountryStats[] = [
  {
    id: "us",
    name: "United States",
    code: "US",
    coordinates: [-98.5, 39.8],
    visitors: 184200,
    sessions: 241800,
    conversionRate: 4.82,
    change: 14.6,
  },
  {
    id: "in",
    name: "India",
    code: "IN",
    coordinates: [78.9, 20.6],
    visitors: 142600,
    sessions: 189400,
    conversionRate: 3.94,
    change: 22.4,
  },
  {
    id: "gb",
    name: "United Kingdom",
    code: "GB",
    coordinates: [-2.5, 54.0],
    visitors: 91300,
    sessions: 118500,
    conversionRate: 4.45,
    change: 9.8,
  },
  {
    id: "de",
    name: "Germany",
    code: "DE",
    coordinates: [10.4, 51.2],
    visitors: 78400,
    sessions: 102100,
    conversionRate: 4.18,
    change: 11.2,
  },
  {
    id: "ca",
    name: "Canada",
    code: "CA",
    coordinates: [-106.3, 56.1],
    visitors: 64900,
    sessions: 84200,
    conversionRate: 4.32,
    change: 7.4,
  },
  {
    id: "au",
    name: "Australia",
    code: "AU",
    coordinates: [133.8, -25.3],
    visitors: 52100,
    sessions: 68900,
    conversionRate: 3.85,
    change: 6.1,
  },
  {
    id: "jp",
    name: "Japan",
    code: "JP",
    coordinates: [138.2, 36.2],
    visitors: 47800,
    sessions: 63400,
    conversionRate: 3.62,
    change: -2.4,
  },
];

const RAW_TIME_SERIES: TimeSeriesPoint[] = [
  { date: "Nov 01", visitors: 16400, sessions: 21200, previousVisitors: 14100, revenue: 12400, channel: "Organic" },
  { date: "Nov 03", visitors: 18900, sessions: 24500, previousVisitors: 15800, revenue: 14200, channel: "Direct" },
  { date: "Nov 05", visitors: 17200, sessions: 22100, previousVisitors: 16200, revenue: 13100, channel: "Social" },
  { date: "Nov 07", visitors: 21800, sessions: 28400, previousVisitors: 17900, revenue: 16800, channel: "Organic" },
  { date: "Nov 09", visitors: 24300, sessions: 31500, previousVisitors: 19400, revenue: 18900, channel: "Paid" },
  { date: "Nov 11", visitors: 22900, sessions: 29800, previousVisitors: 20100, revenue: 17600, channel: "Referral" },
  { date: "Nov 13", visitors: 26700, sessions: 34200, previousVisitors: 21500, revenue: 21400, channel: "Organic" },
  { date: "Nov 15", visitors: 25400, sessions: 32900, previousVisitors: 22000, revenue: 19800, channel: "Direct" },
  { date: "Nov 17", visitors: 29100, sessions: 37800, previousVisitors: 23400, revenue: 23900, channel: "Paid" },
  { date: "Nov 19", visitors: 31800, sessions: 41200, previousVisitors: 24800, revenue: 26200, channel: "Organic" },
  { date: "Nov 21", visitors: 30200, sessions: 39100, previousVisitors: 25600, revenue: 24700, channel: "Social" },
  { date: "Nov 23", visitors: 34600, sessions: 44800, previousVisitors: 27100, revenue: 28900, channel: "Organic" },
  { date: "Nov 25", visitors: 37900, sessions: 49200, previousVisitors: 28900, revenue: 31500, channel: "Direct" },
];

export const MOCK_CATEGORIES: CategoryMetric[] = [
  { name: "Organic", value: 248500, previousValue: 212000, color: ANALYTICS_ACCENT_COLORS.cyan },
  { name: "Direct", value: 164200, previousValue: 149000, color: ANALYTICS_ACCENT_COLORS.electricBlue },
  { name: "Paid", value: 118900, previousValue: 96400, color: ANALYTICS_ACCENT_COLORS.violet },
  { name: "Social", value: 84600, previousValue: 78200, color: ANALYTICS_ACCENT_COLORS.emerald },
  { name: "Referral", value: 45100, previousValue: 41800, color: ANALYTICS_ACCENT_COLORS.softOrange },
];

export const MOCK_FUNNEL: FunnelItem[] = [
  { stage: "Landing Page Visits", count: 661300, color: ANALYTICS_ACCENT_COLORS.electricBlue },
  { stage: "Product Exploration", count: 412800, color: ANALYTICS_ACCENT_COLORS.cyan },
  { stage: "Sign-up / Trial Started", count: 168400, color: ANALYTICS_ACCENT_COLORS.violet },
  { stage: "Checkout Initiated", count: 64200, color: ANALYTICS_ACCENT_COLORS.softOrange },
  { stage: "Completed Conversions", count: 28940, color: ANALYTICS_ACCENT_COLORS.emerald },
];

export const MOCK_RADAR: RadarItem[] = [
  { metric: "Acquisition", current: 88, benchmark: 74 },
  { metric: "Engagement", current: 82, benchmark: 70 },
  { metric: "Retention", current: 76, benchmark: 68 },
  { metric: "Speed", current: 94, benchmark: 80 },
  { metric: "Conversion", current: 79, benchmark: 64 },
  { metric: "Advocacy", current: 72, benchmark: 60 },
];

const RANGE_MULTIPLIER: Record<DateRangePreset, number> = {
  today: 0.08,
  "7d": 0.32,
  "30d": 1,
  "90d": 2.65,
  custom: 0.58,
};

export function getFilteredAnalytics(params: {
  dateRange: DateRangePreset;
  channel: AnalyticsChannel;
  countryId: string | null;
  searchQuery: string;
}) {
  const { dateRange, channel, countryId, searchQuery } = params;
  const rangeFactor = RANGE_MULTIPLIER[dateRange];

  const selectedCountry = countryId
    ? MOCK_COUNTRIES.find((c) => c.id === countryId) ?? null
    : null;

  const countryFactor = selectedCountry
    ? selectedCountry.visitors / 661300
    : 1;

  const channelFactor =
    channel === "all"
      ? 1
      : (MOCK_CATEGORIES.find((c) => c.name === channel)?.value ?? 120000) /
        661300;

  const scale = rangeFactor * countryFactor * channelFactor;

  const timeSeries = RAW_TIME_SERIES.filter((pt) =>
    channel === "all" ? true : pt.channel === channel || scale > 0
  ).map((pt) => ({
    date: pt.date,
    visitors: Math.round(pt.visitors * scale),
    sessions: Math.round(pt.sessions * scale),
    previousVisitors: Math.round(pt.previousVisitors * scale),
    revenue: Math.round(pt.revenue * scale),
  }));

  const categories = MOCK_CATEGORIES.filter((cat) => {
    const matchesChannel = channel === "all" || cat.name === channel;
    const matchesSearch =
      !searchQuery ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  }).map((cat) => ({
    ...cat,
    value: Math.round(cat.value * rangeFactor * countryFactor),
    previousValue: Math.round(cat.previousValue * rangeFactor * countryFactor),
  }));

  const countries = MOCK_COUNTRIES.filter((c) =>
    !searchQuery
      ? true
      : c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
  ).map((c) => ({
    ...c,
    visitors: Math.round(c.visitors * rangeFactor * channelFactor),
    sessions: Math.round(c.sessions * rangeFactor * channelFactor),
  }));

  const totalVisitors = Math.max(120, Math.round(661300 * scale));
  const totalSessions = Math.max(180, Math.round(868300 * scale));
  const pageViews = Math.max(400, Math.round(2489000 * scale));
  const bounceRate = selectedCountry ? 31.4 : channel === "Social" ? 41.2 : 34.8;
  const conversionRate = selectedCountry
    ? selectedCountry.conversionRate
    : channel === "Organic"
    ? 4.92
    : 4.38;
  const revenue = Math.max(850, Math.round(249400 * scale));

  const kpis: KpiMetric[] = [
    {
      id: "visitors",
      label: "Total Visitors",
      value: totalVisitors,
      change: 14.8,
      sparkline: [32, 38, 35, 44, 49, 54, 61, 68],
      compact: true,
      accentColor: ANALYTICS_ACCENT_COLORS.cyan,
    },
    {
      id: "sessions",
      label: "Total Sessions",
      value: totalSessions,
      change: 11.4,
      sparkline: [41, 45, 43, 52, 56, 60, 67, 74],
      compact: true,
      accentColor: ANALYTICS_ACCENT_COLORS.electricBlue,
    },
    {
      id: "pageviews",
      label: "Page Views",
      value: pageViews,
      change: 18.2,
      sparkline: [55, 62, 58, 70, 74, 81, 88, 96],
      compact: true,
      accentColor: ANALYTICS_ACCENT_COLORS.violet,
    },
    {
      id: "bounce",
      label: "Bounce Rate",
      value: bounceRate,
      change: -3.2,
      sparkline: [42, 40, 39, 38, 37, 36, 35, 34.8],
      suffix: "%",
      decimals: 1,
      accentColor: ANALYTICS_ACCENT_COLORS.softOrange,
      invertTrend: true,
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: conversionRate,
      change: 6.4,
      sparkline: [3.2, 3.5, 3.4, 3.8, 4.0, 4.1, 4.3, 4.38],
      suffix: "%",
      decimals: 2,
      accentColor: ANALYTICS_ACCENT_COLORS.emerald,
    },
    {
      id: "revenue",
      label: "Revenue",
      value: revenue,
      change: 21.5,
      sparkline: [12, 15, 14, 19, 22, 24, 28, 31],
      prefix: "$",
      compact: true,
      accentColor: ANALYTICS_ACCENT_COLORS.coralRed,
    },
  ];

  const funnel = MOCK_FUNNEL.map((item) => ({
    ...item,
    count: Math.max(12, Math.round(item.count * scale)),
  }));

  return {
    kpis,
    timeSeries,
    categories,
    countries,
    funnel,
    radar: MOCK_RADAR,
    selectedCountry,
  };
}
