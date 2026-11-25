"use client";

import { useMemo, useState } from "react";
import { getFilteredAnalytics } from "../data/mockAnalytics";
import type { AnalyticsChannel, AnalyticsFilterState } from "../types/analytics";
import type { DateRangePreset } from "@/lib/constants";

export function useAnalyticsFilter() {
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    dateRange: "30d",
    customStart: "2026-11-01",
    customEnd: "2026-11-25",
    channel: "all",
    countryId: null,
    searchQuery: "",
    comparePrevious: true,
  });

  const analytics = useMemo(
    () =>
      getFilteredAnalytics({
        dateRange: filters.dateRange,
        channel: filters.channel,
        countryId: filters.countryId,
        searchQuery: filters.searchQuery,
      }),
    [filters.dateRange, filters.channel, filters.countryId, filters.searchQuery]
  );

  const setDateRange = (dateRange: DateRangePreset) =>
    setFilters((prev) => ({ ...prev, dateRange }));

  const setCustomDates = (customStart: string, customEnd: string) =>
    setFilters((prev) => ({ ...prev, customStart, customEnd }));

  const setChannel = (channel: AnalyticsChannel) =>
    setFilters((prev) => ({ ...prev, channel }));

  const setCountryId = (countryId: string | null) =>
    setFilters((prev) => ({ ...prev, countryId }));

  const setSearchQuery = (searchQuery: string) =>
    setFilters((prev) => ({ ...prev, searchQuery }));

  const toggleCompare = () =>
    setFilters((prev) => ({ ...prev, comparePrevious: !prev.comparePrevious }));

  return {
    filters,
    analytics,
    setDateRange,
    setCustomDates,
    setChannel,
    setCountryId,
    setSearchQuery,
    toggleCompare,
  };
}
