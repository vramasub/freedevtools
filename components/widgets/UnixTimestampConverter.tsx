"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy value"
      className="shrink-0 text-[#14140F]/40 hover:text-[#0E7A5F]"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

function parseTimestamp(input: string) {
  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  // 13+ digits is milliseconds; fewer is seconds.
  const ms = trimmed.length >= 13 ? Number(trimmed) : Number(trimmed) * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return { utc: d.toUTCString(), local: d.toLocaleString(), iso: d.toISOString() };
}

export default function UnixTimestampConverter() {
  const [now, setNow] = useState<number | null>(null);
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const parsed = tsInput ? parseTimestamp(tsInput) : null;
  const tsInvalid = tsInput.trim() !== "" && parsed === null;

  const dateObj = dateInput ? new Date(dateInput) : null;
  const dateValid = dateObj !== null && !isNaN(dateObj.getTime());
  const epochSeconds = dateValid ? Math.floor(dateObj.getTime() / 1000) : null;
  const epochMs = dateValid ? dateObj.getTime() : null;

  const rowClass =
    "flex items-center gap-3 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] px-4 py-2.5";
  const labelClass = "w-24 shrink-0 text-xs font-medium text-[#14140F]/55";
  const valueClass = "min-w-0 flex-1 truncate font-mono text-sm text-[#14140F]";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#14140F]/70">Current Unix time</span>
          <div className="flex items-center gap-2">
            <code className="font-mono text-lg text-[#14140F]">
              {now === null ? "…" : Math.floor(now / 1000)}
            </code>
            {now !== null && <CopyValue value={String(Math.floor(now / 1000))} />}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
        <label htmlFor="ts-input" className="block text-sm font-medium text-[#14140F]/70">
          Timestamp to date
        </label>
        <input
          id="ts-input"
          type="text"
          inputMode="numeric"
          value={tsInput}
          onChange={(e) => setTsInput(e.target.value)}
          placeholder="e.g. 1735689600"
          className="mt-1 w-full rounded-lg border border-[#14140F]/15 px-3 py-2 font-mono text-sm focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
        />
        {tsInvalid && (
          <p className="mt-2 text-sm text-[#DC2626]">Enter a whole number (Unix seconds or milliseconds).</p>
        )}
        {parsed && (
          <div className="mt-4 space-y-2">
            <div className={rowClass}>
              <span className={labelClass}>Local</span>
              <span className={valueClass}>{parsed.local}</span>
              <CopyValue value={parsed.local} />
            </div>
            <div className={rowClass}>
              <span className={labelClass}>UTC</span>
              <span className={valueClass}>{parsed.utc}</span>
              <CopyValue value={parsed.utc} />
            </div>
            <div className={rowClass}>
              <span className={labelClass}>ISO 8601</span>
              <span className={valueClass}>{parsed.iso}</span>
              <CopyValue value={parsed.iso} />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
        <label htmlFor="date-input" className="block text-sm font-medium text-[#14140F]/70">
          Date to timestamp
        </label>
        <input
          id="date-input"
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#14140F]/15 px-3 py-2 text-sm focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F] sm:w-auto"
        />
        {epochSeconds !== null && epochMs !== null && (
          <div className="mt-4 space-y-2">
            <div className={rowClass}>
              <span className={labelClass}>Seconds</span>
              <span className={valueClass}>{epochSeconds}</span>
              <CopyValue value={String(epochSeconds)} />
            </div>
            <div className={rowClass}>
              <span className={labelClass}>Milliseconds</span>
              <span className={valueClass}>{epochMs}</span>
              <CopyValue value={String(epochMs)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
