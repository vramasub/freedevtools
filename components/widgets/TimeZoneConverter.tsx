"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Check, Clock, Copy, Moon, Pause, Play, Sun, X } from "lucide-react";
import {
  ZONE_OPTIONS,
  SLOTS_PER_DAY,
  bandsFor,
  dayStartInstant,
  formatClock,
  formatDay,
  formatOffset,
  formatOffsetDifference,
  getOffsetMinutes,
  localDateString,
  localHourFraction,
  longestSharedWorkWindow,
  slotInstant,
  zoneAbbreviation,
  zoneLabel,
  zonedToInstant,
  type Band,
} from "@/lib/timezones";

const MAX_ZONES = 8;
const LAST_MINUTE = 1439;
const PLAY_DAY_MS = 14000;
const RULER_HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

const BAND_COLOR: Record<Band, string> = {
  night: "rgba(20, 20, 15, 0.13)",
  wake: "transparent",
  work: "rgba(14, 122, 95, 0.24)",
};

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReducedMotion = () => false;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function hhmm(hourFraction: number): string {
  const total = Math.round(hourFraction * 60);
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const controlButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#14140F]/15 bg-white px-3 py-2 text-sm font-medium text-[#14140F] transition-colors hover:border-[#0E7A5F]/50 disabled:opacity-40";

export default function TimeZoneConverter() {
  const [now, setNow] = useState<number | null>(null);
  const [customZones, setCustomZones] = useState<string[] | null>(null);
  const [dateOverride, setDateOverride] = useState<string | null>(null);
  const [minutesOverride, setMinutesOverride] = useState<number | null>(null);
  const [hour12, setHour12] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const animRef = useRef<number | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );

  // The visitor's own clock and zone only exist in the browser, so nothing time-dependent
  // renders until after mount — otherwise server and client HTML would disagree.
  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearTimeout(first);
      clearInterval(tick);
    };
  }, []);

  useEffect(
    () => () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    },
    []
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = t - last;
      last = t;
      setMinutesOverride((prev) => {
        const next = (prev ?? 0) + (dt * 1440) / PLAY_DAY_MS;
        return next >= LAST_MINUTE ? 0 : next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const localTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const mounted = now !== null;

  const zones = useMemo(() => {
    if (!mounted) return [];
    if (customZones) return customZones;
    const defaults = [localTz, "America/New_York", "Europe/London", "Asia/Kolkata"];
    return defaults.filter((tz, i) => defaults.indexOf(tz) === i);
  }, [mounted, customZones, localTz]);

  const home = zones[0] ?? null;
  const todayString = now !== null && home ? localDateString(home, now) : null;
  const date = dateOverride ?? todayString;
  const start = home && date ? dayStartInstant(home, date) : null;
  const todayStart = home && todayString ? dayStartInstant(home, todayString) : null;

  const nowMinutes =
    now !== null && todayStart !== null
      ? clamp(Math.round((now - todayStart) / 60000), 0, LAST_MINUTE)
      : 0;
  const defaultMinutes = date === todayString ? Math.round(nowMinutes / 5) * 5 : 9 * 60;
  const minutes = minutesOverride ?? defaultMinutes;

  const bandsByZone = useMemo(
    () => (start === null ? [] : zones.map((tz) => bandsFor(tz, start))),
    [zones, start]
  );
  const sharedWindow = useMemo(() => longestSharedWorkWindow(bandsByZone), [bandsByZone]);

  function stopMotion() {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setPlaying(false);
  }

  function sweepTo(target: number) {
    stopMotion();
    if (reducedMotion) {
      setMinutesOverride(target);
      return;
    }
    const from = minutes;
    let t0: number | null = null;
    const duration = Math.min(1000, 350 + Math.abs(target - from) * 0.7);
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setMinutesOverride(from + (target - from) * eased);
      animRef.current = p < 1 ? requestAnimationFrame(step) : null;
    };
    animRef.current = requestAnimationFrame(step);
  }

  function goToNow() {
    setDateOverride(null);
    sweepTo(Math.round(nowMinutes / 5) * 5);
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    stopMotion();
    setMinutesOverride(minutes);
    setPlaying(true);
  }

  function setHomeTime(value: string) {
    if (!home || !date || !value) return;
    const [hh, mm] = value.split(":").map(Number);
    const [y, m, d] = date.split("-").map(Number);
    const instant = zonedToInstant(y, m, d, hh, mm, home);
    stopMotion();
    setMinutesOverride(clamp((instant - dayStartInstant(home, date)) / 60000, 0, LAST_MINUTE));
  }

  function makeHome(tz: string) {
    if (start === null) return;
    const instant = start + Math.round(minutes) * 60000;
    const newDate = localDateString(tz, instant);
    const newStart = dayStartInstant(tz, newDate);
    stopMotion();
    setCustomZones([tz, ...zones.filter((z) => z !== tz)]);
    setDateOverride(newDate);
    setMinutesOverride(clamp((instant - newStart) / 60000, 0, LAST_MINUTE));
  }

  function addZone(tz: string) {
    if (!tz || zones.length >= MAX_ZONES || zones.includes(tz)) return;
    setCustomZones([...zones, tz]);
  }

  function removeZone(tz: string) {
    setCustomZones(zones.filter((z) => z !== tz));
  }

  if (!home || !date || start === null) {
    return (
      <div className="rounded-xl border border-[#14140F]/10 bg-white p-6 text-sm text-[#14140F]/50">
        Loading your time zones…
      </div>
    );
  }

  const instant = start + Math.round(minutes) * 60000;
  const homeOffset = getOffsetMinutes(home, instant);
  const homeDate = localDateString(home, instant);
  const linePercent = (clamp(minutes, 0, LAST_MINUTE) / LAST_MINUTE) * 100;
  const nowPercent = now !== null ? ((now - start) / (1440 * 60000)) * 100 : -1;
  const availableOptions = ZONE_OPTIONS.filter((option) => !zones.includes(option.tz));
  const monoStyle = { fontFamily: "var(--font-jetbrains-mono)" };
  const displayStyle = { fontFamily: "var(--font-space-grotesk)" };

  const overlapText =
    zones.length < 2
      ? "Add another city to see when your working hours overlap."
      : sharedWindow
        ? `Everyone is within 9:00–17:00 working hours from ${formatClock(home, slotInstant(start, sharedWindow.startSlot), hour12)} to ${formatClock(home, slotInstant(start, sharedWindow.endSlot), hour12)} home time.`
        : "No hour of this day falls inside everyone’s 9:00–17:00 working hours.";

  async function copySummary() {
    const lines = zones.map(
      (tz) => `${zoneLabel(tz)}: ${formatDay(tz, instant)}, ${formatClock(tz, instant, hour12)}`
    );
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-[#14140F]/55">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDateOverride(e.target.value)}
            className="mt-1 block rounded-lg border border-[#14140F]/15 px-3 py-1.5 text-sm text-[#14140F] focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
            style={monoStyle}
          />
        </label>
        <label className="text-xs font-medium text-[#14140F]/55">
          Time in {zoneLabel(home)}
          <input
            type="time"
            value={hhmm(localHourFraction(home, instant))}
            onChange={(e) => setHomeTime(e.target.value)}
            className="mt-1 block rounded-lg border border-[#14140F]/15 px-3 py-1.5 text-sm text-[#14140F] focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
            style={monoStyle}
          />
        </label>
        <button type="button" onClick={goToNow} className={controlButton}>
          <Clock size={15} />
          Now
        </button>
        {!reducedMotion && (
          <button type="button" onClick={togglePlay} aria-pressed={playing} className={controlButton}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            {playing ? "Pause" : "Play the day"}
          </button>
        )}
        <div className="inline-flex overflow-hidden rounded-lg border border-[#14140F]/15" role="group" aria-label="Clock format">
          {[true, false].map((is12) => (
            <button
              key={String(is12)}
              type="button"
              aria-pressed={hour12 === is12}
              onClick={() => setHour12(is12)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                hour12 === is12 ? "bg-[#14140F] text-white" : "bg-white text-[#14140F]/70 hover:bg-[#14140F]/5"
              }`}
            >
              {is12 ? "12h" : "24h"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="grid gap-x-4 sm:grid-cols-[13rem_1fr]">
          <span className="hidden sm:block" />
          <div className="relative h-5" aria-hidden="true">
            {RULER_HOURS.map((hour) => (
              <span
                key={hour}
                className="absolute top-0 -translate-x-1/2 text-[11px] text-[#14140F]/40"
                style={{ left: `${(hour / 24) * 100}%`, ...monoStyle }}
              >
                {hour12 ? (hour === 0 ? "12a" : hour < 12 ? `${hour}a` : hour === 12 ? "12p" : `${hour - 12}p`) : String(hour).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-[#14140F]/8">
          {zones.map((tz, index) => {
            const isHome = index === 0;
            const offset = getOffsetMinutes(tz, instant);
            const localDate = localDateString(tz, instant);
            const dayShift = Math.round((Date.parse(localDate) - Date.parse(homeDate)) / 86400000);
            const hourNow = localHourFraction(tz, instant);
            const isDay = hourNow >= 6 && hourNow < 18;
            const abbreviation = zoneAbbreviation(tz, instant);
            const bands = bandsByZone[index] ?? [];

            return (
              <li
                key={tz}
                className="grid gap-x-4 gap-y-2 py-3 transition-[opacity,transform] duration-300 starting:translate-y-2 starting:opacity-0 sm:grid-cols-[13rem_1fr] sm:items-center"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="relative inline-block h-4 w-4 shrink-0" aria-hidden="true">
                        <Sun
                          size={16}
                          className={`absolute inset-0 text-[#B5751A] transition-all duration-500 ${
                            isDay ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
                          }`}
                        />
                        <Moon
                          size={16}
                          className={`absolute inset-0 text-[#4438CA] transition-all duration-500 ${
                            isDay ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
                          }`}
                        />
                      </span>
                      <span className="text-sm font-semibold leading-tight text-[#14140F]" style={displayStyle}>
                        {zoneLabel(tz)}
                      </span>
                      {isHome && (
                        <span className="rounded bg-[#0E7A5F]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#0E7A5F]">
                          Home
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tracking-tight text-[#14140F]" style={monoStyle}>
                        {formatClock(tz, instant, hour12)}
                      </span>
                      {dayShift !== 0 && (
                        <span className="text-xs font-medium text-[#E1502E]">
                          {dayShift > 0 ? "+1 day" : "−1 day"}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-[#14140F]/50">
                      {formatDay(tz, instant)}
                      {" · "}
                      {formatOffset(offset)}
                      {abbreviation && abbreviation !== "UTC" && ` ${abbreviation}`}
                    </div>
                    {!isHome && (
                      <div className="text-xs text-[#14140F]/40">{formatOffsetDifference(offset - homeOffset)}</div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {!isHome && (
                      <>
                        <button
                          type="button"
                          onClick={() => makeHome(tz)}
                          className="text-xs font-medium text-[#14140F]/50 hover:text-[#0E7A5F]"
                        >
                          Make home
                        </button>
                        <button
                          type="button"
                          onClick={() => removeZone(tz)}
                          aria-label={`Remove ${zoneLabel(tz)}`}
                          className="text-[#14140F]/35 hover:text-[#DC2626]"
                        >
                          <X size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative h-11 overflow-hidden rounded-md border border-[#14140F]/10 bg-[#FAF9F5] focus-within:ring-2 focus-within:ring-[#0E7A5F]">
                  <div className="flex h-full" aria-hidden="true">
                    {bands.map((band, slot) => (
                      <div
                        key={slot}
                        className={`h-full flex-1 ${slot % 2 === 0 && slot > 0 ? "border-l border-[#14140F]/6" : ""}`}
                        style={{ backgroundColor: BAND_COLOR[band] }}
                      />
                    ))}
                    {bands.length === 0 && <div className="h-full flex-1" />}
                  </div>
                  {sharedWindow && zones.length > 1 && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 border-x-2 border-dashed border-[#0E7A5F]"
                      style={{
                        left: `${(sharedWindow.startSlot / SLOTS_PER_DAY) * 100}%`,
                        width: `${((sharedWindow.endSlot - sharedWindow.startSlot) / SLOTS_PER_DAY) * 100}%`,
                      }}
                    />
                  )}
                  {nowPercent >= 0 && nowPercent <= 100 && (
                    <span
                      aria-hidden="true"
                      title="Current time"
                      className="pointer-events-none absolute bottom-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#E1502E]"
                      style={{ left: `${nowPercent}%` }}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#14140F]"
                    style={{ left: `${linePercent}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={LAST_MINUTE}
                    step={5}
                    value={Math.round(minutes)}
                    onChange={(e) => {
                      stopMotion();
                      setMinutesOverride(Number(e.target.value));
                    }}
                    tabIndex={isHome ? 0 : -1}
                    aria-hidden={isHome ? undefined : true}
                    aria-label={`Time of day in ${zoneLabel(home)}`}
                    aria-valuetext={formatClock(home, instant, hour12)}
                    className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-[#14140F]/65">{overlapText}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="tz-add">
            Add a city
          </label>
          <select
            id="tz-add"
            value=""
            disabled={zones.length >= MAX_ZONES}
            onChange={(e) => addZone(e.target.value)}
            className="rounded-lg border border-[#14140F]/15 bg-white px-3 py-2 text-sm text-[#14140F] focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F] disabled:opacity-40"
          >
            <option value="">{zones.length >= MAX_ZONES ? "Limit reached" : "Add a city…"}</option>
            {availableOptions.map((option) => (
              <option key={option.tz} value={option.tz}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={copySummary} className={controlButton}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy times"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[#14140F]/8 pt-4 text-xs text-[#14140F]/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-sm" style={{ backgroundColor: BAND_COLOR.work }} />
          Working hours (9:00–17:00)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-sm border border-[#14140F]/10" />
          Awake
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-sm" style={{ backgroundColor: BAND_COLOR.night }} />
          Night
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E1502E]" />
          Right now
        </span>
      </div>
    </div>
  );
}
