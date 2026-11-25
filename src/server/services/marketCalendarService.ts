import type { MarketSessionStatus, MarketStatusInfo } from "@/types/market";

/**
 * Official BSE/NSE Indian equity market holidays for 2026 (YYYY-MM-DD in IST).
 */
const BSE_HOLIDAYS_2026 = new Set<string>([
  "2026-01-26", // Republic Day
  "2026-03-03", // Holi
  "2026-03-26", // Shri Ram Navami
  "2026-03-31", // Shri Mahavir Jayanti
  "2026-04-03", // Good Friday
  "2026-04-14", // Dr. Baba Saheb Ambedkar Jayanti
  "2026-05-01", // Maharashtra Day
  "2026-05-28", // Bakri Id
  "2026-06-26", // Muharram
  "2026-09-14", // Ganesh Chaturthi
  "2026-10-02", // Mahatma Gandhi Jayanti
  "2026-10-20", // Dussehra
  "2026-11-10", // Diwali-Balipratipada
  "2026-11-24", // Prakash Gurpurb Sri Guru Nanak Dev
  "2026-12-25", // Christmas
]);

/**
 * Computes Indian exchange session status (MARKET OPEN, PRE-OPEN, MARKET CLOSED)
 * from real IST calendar, weekday, and BSE session windows.
 */
export function getIndianMarketStatus(now: Date = new Date()): MarketStatusInfo {
  const istFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = istFormatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const weekday = get("weekday");
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const second = get("second");

  const istDate = `${year}-${month}-${day}`;
  const istTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${second} IST`;
  const totalMinutes = hour * 60 + minute;

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isHoliday = BSE_HOLIDAYS_2026.has(istDate);

  let status: MarketSessionStatus = "MARKET CLOSED";
  let reason = "Outside BSE regular trading hours (09:15 - 15:30 IST)";
  let nextSessionNote = "Next regular session opens at 09:15 IST";

  if (isWeekend) {
    status = "MARKET CLOSED";
    reason = `Weekend (${weekday}) — BSE closed`;
    nextSessionNote = "Opens Monday at 09:00 IST (Pre-open)";
  } else if (isHoliday) {
    status = "MARKET CLOSED";
    reason = `Exchange Holiday (${istDate})`;
    nextSessionNote = "Resumes next trading day at 09:00 IST";
  } else if (totalMinutes >= 540 && totalMinutes < 555) {
    // 09:00 - 09:15 IST (Pre-open order collection & matching)
    status = "PRE-OPEN";
    reason = "BSE Pre-Open Session (09:00 - 09:15 IST)";
    nextSessionNote = "Continuous trading begins at 09:15 IST";
  } else if (totalMinutes >= 555 && totalMinutes <= 930) {
    // 09:15 - 15:30 IST
    status = "MARKET OPEN";
    reason = "BSE Continuous Trading Session (09:15 - 15:30 IST)";
    nextSessionNote = "Session closes at 15:30 IST";
  }

  return {
    status,
    istTime,
    istDate,
    reason,
    nextSessionNote,
  };
}
