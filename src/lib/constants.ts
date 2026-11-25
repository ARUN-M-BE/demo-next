export const ANALYTICS_ACCENT_COLORS = {
  electricBlue: "#3B82F6",
  cyan: "#22D3EE",
  violet: "#8B5CF6",
  emerald: "#10B981",
  softOrange: "#F59E0B",
  coralRed: "#F43F5E",
} as const;

export const DATE_RANGE_OPTIONS = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "custom", label: "Custom Range", days: 14 },
] as const;

export type DateRangePreset = (typeof DATE_RANGE_OPTIONS)[number]["id"];

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Channels" },
  { value: "Organic", label: "Organic Search" },
  { value: "Direct", label: "Direct" },
  { value: "Social", label: "Social Media" },
  { value: "Referral", label: "Referral" },
  { value: "Paid", label: "Paid Campaigns" },
] as const;
