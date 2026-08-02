"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, Loader2, Upload } from "lucide-react";
import { downloadText } from "@/lib/download";
import {
  LOG_LEVELS,
  filterEntries,
  parseLog,
  type LogEntry,
  type LogFormat,
  type LogLevel,
  type ParsedLog,
} from "@/lib/converters/logAnalysis";

const SAMPLE_TEXT = `2024-06-03 09:12:01 INFO  Starting checkout-service v2.3.1
2024-06-03 09:12:04 INFO  Listening on port 8080
2024-06-03 09:14:22 ERROR Failed to charge card for order #48291
java.lang.NullPointerException: Cannot invoke "Customer.getId()" because "customer" is null
\tat com.acme.billing.ChargeService.charge(ChargeService.java:88)
\tat com.acme.billing.CheckoutController.submit(CheckoutController.java:41)
Caused by: com.acme.db.RecordNotFoundException: customer 48291 not found
\tat com.acme.db.CustomerRepository.find(CustomerRepository.java:23)
\t... 4 more
2024-06-03 09:14:23 WARN  Retrying charge for order #48291 (attempt 1)
2024-06-03 09:15:01 ERROR Failed to charge card for order #48291
java.lang.NullPointerException: Cannot invoke "Customer.getId()" because "customer" is null
\tat com.acme.billing.ChargeService.charge(ChargeService.java:88)
2024-06-03 09:16:40 INFO  Health check OK`;

const SAMPLE_JSONL = `{"timestamp":"2024-06-03T09:12:01Z","level":"info","message":"Starting checkout-service"}
{"timestamp":"2024-06-03T09:14:22Z","level":"error","message":"Failed to charge card","orderId":48291}
{"timestamp":"2024-06-03T09:14:23Z","severity":"WARN","message":"Retrying charge","orderId":48291,"attempt":1}
{"timestamp":"2024-06-03T09:15:01Z","level":"error","message":"Failed to charge card","orderId":48291}
{"timestamp":"2024-06-03T09:16:40Z","level":"info","message":"Health check OK"}`;

const RENDER_CAP = 300;

interface Segment {
  text: string;
  isMatch: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSegments(text: string, query: string, isRegex: boolean, caseSensitive: boolean): Segment[] {
  if (!query.trim()) return [{ text, isMatch: false }];

  let regex: RegExp;
  try {
    regex = new RegExp(isRegex ? query : escapeRegExp(query), caseSensitive ? "g" : "gi");
  } catch {
    return [{ text, isMatch: false }];
  }

  const parts: Segment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let guard = 0;

  while ((match = regex.exec(text)) && guard < 1000) {
    guard++;
    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index), isMatch: false });
    parts.push({ text: match[0] || " ", isMatch: true });
    cursor = match.index + (match[0].length || 1);
    if (match[0].length === 0) regex.lastIndex++;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), isMatch: false });

  return parts;
}

const LEVEL_CHIP_CLASSES: Record<LogLevel, string> = {
  FATAL: "bg-red-100 text-red-800 border-red-200",
  ERROR: "bg-red-50 text-red-700 border-red-200",
  WARN: "bg-amber-50 text-amber-700 border-amber-200",
  INFO: "bg-sky-50 text-sky-700 border-sky-200",
  DEBUG: "bg-slate-100 text-slate-600 border-slate-200",
  TRACE: "bg-slate-100 text-slate-500 border-slate-200",
  UNKNOWN: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function LogAnalyzer() {
  const [rawInput, setRawInput] = useState("");
  const [formatOverride, setFormatOverride] = useState<LogFormat | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(new Set());
  const [parsed, setParsed] = useState<ParsedLog | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Stage A: parse raw input into entries only when the input (or format override) changes.
  // isAnalyzing is flipped true by the input handlers below (setRawInput/setFormatOverride
  // callers) so React can paint the spinner before this effect's synchronous parse work runs.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (!rawInput.trim()) {
        setParsed(null);
        setIsAnalyzing(false);
        return;
      }
      setParsed(parseLog(rawInput, formatOverride ?? undefined));
      setIsAnalyzing(false);
    }, 0);
    return () => clearTimeout(handle);
  }, [rawInput, formatOverride]);

  // Debounce the search query so typing never triggers re-parsing or expensive re-filtering.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), 280);
    return () => clearTimeout(handle);
  }, [query]);

  // Stage B: filter already-parsed entries — cheap, operates only on parsed.entries.
  const filterResult = useMemo(() => {
    if (!parsed) return null;
    return filterEntries(parsed.entries, {
      query: debouncedQuery,
      isRegex,
      caseSensitive,
      levels: selectedLevels.size > 0 ? selectedLevels : null,
    });
  }, [parsed, debouncedQuery, isRegex, caseSensitive, selectedLevels]);

  function updateRawInput(value: string) {
    setRawInput(value);
    setIsAnalyzing(true);
  }

  function updateFormatOverride(format: LogFormat | null) {
    setFormatOverride(format);
    setIsAnalyzing(true);
  }

  function toggleLevel(level: LogLevel) {
    setSelectedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateRawInput(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = "";
  }

  async function copyShown() {
    if (!filterResult) return;
    const text = filterResult.matched.slice(0, RENDER_CAP).map((e) => e.raw).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadAll() {
    if (!filterResult) return;
    const text = filterResult.matched.map((e) => e.raw).join("\n\n");
    downloadText(text, "log-analyzer-results.txt");
  }

  const shown = filterResult?.matched.slice(0, RENDER_CAP) ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="log-input" className="text-sm font-medium text-slate-700">
          Log dump
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            onClick={() => updateRawInput(SAMPLE_TEXT)}
          >
            Load stack trace sample
          </button>
          <button
            type="button"
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            onClick={() => updateRawInput(SAMPLE_JSONL)}
          >
            Load JSON Lines sample
          </button>
          <label className="flex cursor-pointer items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800">
            <Upload size={12} />
            Upload file
            <input type="file" accept="*" className="sr-only" onChange={handleUpload} />
          </label>
        </div>
      </div>
      <textarea
        id="log-input"
        className="h-48 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        placeholder="Paste a raw log dump — plain-text stack traces or JSON Lines…"
        value={rawInput}
        onChange={(e) => updateRawInput(e.target.value)}
        spellCheck={false}
      />

      {parsed && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Detected format:</span>
          {(["text", "jsonl"] as LogFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => updateFormatOverride(f)}
              className={`rounded-full border px-2.5 py-1 font-medium ${
                (formatOverride ?? parsed.format) === f
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {f === "text" ? "Plain text" : "JSON Lines"}
            </button>
          ))}
          {formatOverride && (
            <button
              type="button"
              onClick={() => updateFormatOverride(null)}
              className="text-slate-400 underline hover:text-slate-600"
            >
              Reset to auto-detect
            </button>
          )}
        </div>
      )}

      {parsed && (
        <div className="mt-3 flex flex-wrap gap-2">
          {LOG_LEVELS.filter((level) => parsed.levelCounts[level] > 0).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => toggleLevel(level)}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-opacity ${LEVEL_CHIP_CLASSES[level]} ${
                selectedLevels.size > 0 && !selectedLevels.has(level) ? "opacity-40" : ""
              }`}
            >
              {level} ({parsed.levelCounts[level]})
            </button>
          ))}
          {selectedLevels.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedLevels(new Set())}
              className="text-xs font-medium text-slate-500 underline hover:text-slate-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search keyword or pattern…"
          className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <label className="flex items-center gap-1.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isRegex}
            onChange={(e) => setIsRegex(e.target.checked)}
            className="accent-emerald-600"
          />
          Use regex
        </label>
        <label className="flex items-center gap-1.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="accent-emerald-600"
          />
          Case sensitive
        </label>
      </div>

      {filterResult?.error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Invalid pattern: {filterResult.error}
        </p>
      )}

      {isAnalyzing && (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          Analyzing…
        </p>
      )}

      {!isAnalyzing && parsed && filterResult && !filterResult.error && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-700">
              {filterResult.total} of {parsed.entries.length} entries match
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={shown.length === 0}
                onClick={copyShown}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy shown"}
              </button>
              <button
                type="button"
                disabled={filterResult.total === 0}
                onClick={downloadAll}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <Download size={12} />
                Download all
              </button>
            </div>
          </div>

          {filterResult.total > RENDER_CAP && (
            <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Showing {RENDER_CAP} of {filterResult.total} matching entries — refine your search
              or download all results.
            </p>
          )}

          <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto">
            {shown.map((entry: LogEntry) => {
              const segments = buildSegments(entry.raw, debouncedQuery, isRegex, caseSensitive);
              return (
                <li key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_CHIP_CLASSES[entry.level]}`}
                    >
                      {entry.level}
                    </span>
                    <span className="text-[11px] text-slate-400">line {entry.startLine}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs text-slate-800">
                    {segments.map((part, i) =>
                      part.isMatch ? (
                        <mark key={i} className="rounded bg-emerald-200 px-0.5 text-slate-900">
                          {part.text}
                        </mark>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    )}
                  </pre>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
