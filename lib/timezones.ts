export interface ZoneOption {
  label: string;
  tz: string;
}

export const ZONE_OPTIONS: ZoneOption[] = [
  { label: "UTC", tz: "Etc/UTC" },
  { label: "New York (Eastern)", tz: "America/New_York" },
  { label: "Chicago (Central)", tz: "America/Chicago" },
  { label: "Denver (Mountain)", tz: "America/Denver" },
  { label: "Los Angeles (Pacific)", tz: "America/Los_Angeles" },
  { label: "Anchorage", tz: "America/Anchorage" },
  { label: "Honolulu", tz: "Pacific/Honolulu" },
  { label: "Toronto", tz: "America/Toronto" },
  { label: "Vancouver", tz: "America/Vancouver" },
  { label: "Mexico City", tz: "America/Mexico_City" },
  { label: "São Paulo", tz: "America/Sao_Paulo" },
  { label: "Buenos Aires", tz: "America/Argentina/Buenos_Aires" },
  { label: "London", tz: "Europe/London" },
  { label: "Dublin", tz: "Europe/Dublin" },
  { label: "Lisbon", tz: "Europe/Lisbon" },
  { label: "Paris", tz: "Europe/Paris" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Madrid", tz: "Europe/Madrid" },
  { label: "Rome", tz: "Europe/Rome" },
  { label: "Amsterdam", tz: "Europe/Amsterdam" },
  { label: "Athens", tz: "Europe/Athens" },
  { label: "Istanbul", tz: "Europe/Istanbul" },
  { label: "Moscow", tz: "Europe/Moscow" },
  { label: "Cairo", tz: "Africa/Cairo" },
  { label: "Lagos", tz: "Africa/Lagos" },
  { label: "Nairobi", tz: "Africa/Nairobi" },
  { label: "Johannesburg", tz: "Africa/Johannesburg" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Tehran", tz: "Asia/Tehran" },
  { label: "Karachi", tz: "Asia/Karachi" },
  { label: "India (Mumbai, Delhi)", tz: "Asia/Kolkata" },
  { label: "Kathmandu", tz: "Asia/Kathmandu" },
  { label: "Dhaka", tz: "Asia/Dhaka" },
  { label: "Bangkok", tz: "Asia/Bangkok" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Hong Kong", tz: "Asia/Hong_Kong" },
  { label: "Shanghai", tz: "Asia/Shanghai" },
  { label: "Manila", tz: "Asia/Manila" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Seoul", tz: "Asia/Seoul" },
  { label: "Perth", tz: "Australia/Perth" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Auckland", tz: "Pacific/Auckland" },
];

export function zoneLabel(tz: string): string {
  const known = ZONE_OPTIONS.find((z) => z.tz === tz);
  if (known) return known.label;
  return tz.split("/").pop()!.replace(/_/g, " ");
}

// Building an Intl.DateTimeFormat is expensive and the band computation below calls
// into it dozens of times per zone, so each configuration is built once and reused.
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(key: string, tz: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const cacheKey = `${key}|${tz}`;
  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, ...options });
    formatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

function partsOf(tz: string, ms: number): Record<string, number> {
  const parts = getFormatter("parts", tz, {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(ms));
  const out: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = Number(part.value);
  }
  out.hour = out.hour % 24;
  return out;
}

// Offset from UTC, in minutes, that `tz` observes at the instant `ms` (DST-aware).
export function getOffsetMinutes(tz: string, ms: number): number {
  const p = partsOf(tz, ms);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

// The UTC instant at which a wall-clock time occurs in `tz`. The offset is looked up
// twice because the first guess can land on the wrong side of a DST change.
export function zonedToInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  tz: string
): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - getOffsetMinutes(tz, guess) * 60000;
  return guess - getOffsetMinutes(tz, first) * 60000;
}

export function localDateString(tz: string, ms: number): string {
  const p = partsOf(tz, ms);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function dayStartInstant(tz: string, dateString: string): number {
  const [y, m, d] = dateString.split("-").map(Number);
  return zonedToInstant(y, m, d, 0, 0, tz);
}

export function localHourFraction(tz: string, ms: number): number {
  const p = partsOf(tz, ms);
  return p.hour + p.minute / 60;
}

export function formatClock(tz: string, ms: number, hour12: boolean): string {
  return getFormatter(hour12 ? "clock12" : "clock24", tz, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: hour12 ? "h12" : "h23",
  }).format(new Date(ms));
}

export function formatDay(tz: string, ms: number): string {
  return getFormatter("day", tz, { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(ms)
  );
}

// "EST", "PDT", "CET" — only when the zone has a real abbreviation; most zones only get a
// generic "GMT+5:30" label from Intl, which would just repeat the UTC offset.
export function zoneAbbreviation(tz: string, ms: number): string {
  const part = getFormatter("abbr", tz, { timeZoneName: "short" })
    .formatToParts(new Date(ms))
    .find((p) => p.type === "timeZoneName");
  return part && /^[A-Z]{2,5}$/.test(part.value) ? part.value : "";
}

export function formatOffset(minutes: number): string {
  if (minutes === 0) return "UTC+0";
  const sign = minutes > 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

export function formatOffsetDifference(minutes: number): string {
  if (minutes === 0) return "same time as home";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = `${h ? `${h}h` : ""}${m ? ` ${m}m` : ""}`.trim();
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} home`;
}

export type Band = "night" | "wake" | "work";

export const SLOTS_PER_DAY = 48;
const SLOT_MS = 30 * 60000;

// Classifies each half-hour of the 24 hours starting at `startMs` by what the local clock
// in `tz` reads at that moment: working hours (9–17), waking hours (7–22), or night.
export function bandsFor(tz: string, startMs: number): Band[] {
  const bands: Band[] = [];
  for (let i = 0; i < SLOTS_PER_DAY; i++) {
    const hour = localHourFraction(tz, startMs + i * SLOT_MS + SLOT_MS / 2);
    bands.push(hour >= 9 && hour < 17 ? "work" : hour >= 7 && hour < 22 ? "wake" : "night");
  }
  return bands;
}

// Longest stretch of the day where every zone is inside working hours at once.
export function longestSharedWorkWindow(
  allBands: Band[][]
): { startSlot: number; endSlot: number } | null {
  if (allBands.length === 0) return null;
  let best: { startSlot: number; endSlot: number } | null = null;
  let runStart = -1;
  for (let i = 0; i <= SLOTS_PER_DAY; i++) {
    const shared = i < SLOTS_PER_DAY && allBands.every((b) => b[i] === "work");
    if (shared && runStart < 0) runStart = i;
    if (!shared && runStart >= 0) {
      if (!best || i - runStart > best.endSlot - best.startSlot) {
        best = { startSlot: runStart, endSlot: i };
      }
      runStart = -1;
    }
  }
  return best;
}

export function slotInstant(startMs: number, slot: number): number {
  return startMs + slot * SLOT_MS;
}
