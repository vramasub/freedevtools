export type LogFormat = "text" | "jsonl";

export const LOG_LEVELS = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE", "UNKNOWN"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogEntry {
  id: number;
  raw: string;
  searchText: string;
  level: LogLevel;
  startLine: number;
  json?: unknown;
}

const LEVEL_PATTERN = /\b(FATAL|ERROR|WARN(?:ING)?|INFO|DEBUG|TRACE)\b/i;
const JSON_LEVEL_FIELDS = ["level", "severity", "log_level", "loglevel", "levelname", "sev"];
// Matches a bare exception/error class header line (e.g. "java.lang.NullPointerException: ...")
// that commonly appears un-indented immediately after an ERROR log line, before the indented
// "at ..." stack frames — without this, such a line would incorrectly start a new entry.
const EXCEPTION_HEADER_PATTERN = /^[A-Za-z_][\w.$]*(?:Exception|Error)\b/;

function normalizeLevel(value: string): LogLevel {
  const upper = value.toUpperCase();
  if (upper === "WARNING") return "WARN";
  if ((LOG_LEVELS as readonly string[]).includes(upper)) return upper as LogLevel;
  return "UNKNOWN";
}

function detectTextLevel(firstLine: string): LogLevel {
  const match = firstLine.match(LEVEL_PATTERN);
  return match ? normalizeLevel(match[1]) : "UNKNOWN";
}

function detectJsonLevel(obj: unknown): LogLevel {
  if (typeof obj !== "object" || obj === null) return "UNKNOWN";
  const record = obj as Record<string, unknown>;
  const lowerKeyMap = new Map(Object.keys(record).map((k) => [k.toLowerCase(), k]));
  for (const field of JSON_LEVEL_FIELDS) {
    const actualKey = lowerKeyMap.get(field);
    if (actualKey !== undefined && typeof record[actualKey] === "string") {
      return normalizeLevel(record[actualKey] as string);
    }
  }
  return "UNKNOWN";
}

export function detectFormat(raw: string): LogFormat {
  const nonEmptyLines = raw
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const sample = nonEmptyLines.slice(0, 20);
  if (sample.length < 3) return "text";

  let hits = 0;
  for (const line of sample) {
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        hits++;
      }
    } catch {
      // not JSON, ignore
    }
  }

  return hits / sample.length >= 0.8 ? "jsonl" : "text";
}

function isContinuationLine(line: string): boolean {
  if (line === "") return true;
  if (/^\s/.test(line)) return true;
  const trimmed = line.trimStart();
  return (
    trimmed.startsWith("at ") ||
    trimmed.startsWith("Caused by:") ||
    trimmed.startsWith("...") ||
    EXCEPTION_HEADER_PATTERN.test(trimmed)
  );
}

function groupTextEntries(raw: string): LogEntry[] {
  const lines = raw.split(/\r\n|\r|\n/);
  const entries: LogEntry[] = [];
  let current: string[] = [];
  let currentStartLine = 1;
  let id = 0;

  function flush() {
    if (current.length === 0) return;
    const text = current.join("\n");
    entries.push({
      id: id++,
      raw: text,
      searchText: text,
      level: detectTextLevel(current[0]),
      startLine: currentStartLine,
    });
    current = [];
  }

  lines.forEach((line, index) => {
    if (current.length > 0 && isContinuationLine(line)) {
      current.push(line);
      return;
    }
    flush();
    current = [line];
    currentStartLine = index + 1;
  });
  flush();

  return entries;
}

function parseJsonLines(raw: string): LogEntry[] {
  const lines = raw.split(/\r\n|\r|\n/);
  const entries: LogEntry[] = [];
  let id = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const obj = JSON.parse(trimmed);
      entries.push({
        id: id++,
        raw: JSON.stringify(obj, null, 2),
        searchText: trimmed,
        level: detectJsonLevel(obj),
        startLine: index + 1,
        json: obj,
      });
    } catch {
      entries.push({
        id: id++,
        raw: line,
        searchText: line,
        level: "UNKNOWN",
        startLine: index + 1,
      });
    }
  });

  return entries;
}

export interface ParsedLog {
  format: LogFormat;
  entries: LogEntry[];
  levelCounts: Record<LogLevel, number>;
}

export function parseLog(raw: string, formatOverride?: LogFormat): ParsedLog {
  const format = formatOverride ?? detectFormat(raw);
  const entries = format === "jsonl" ? parseJsonLines(raw) : groupTextEntries(raw);

  const levelCounts = Object.fromEntries(LOG_LEVELS.map((l) => [l, 0])) as Record<LogLevel, number>;
  for (const entry of entries) {
    levelCounts[entry.level]++;
  }

  return { format, entries, levelCounts };
}

export interface FilterOptions {
  query: string;
  isRegex: boolean;
  caseSensitive: boolean;
  levels: Set<LogLevel> | null;
}

export interface FilterResult {
  matched: LogEntry[];
  total: number;
  error: string | null;
}

export function filterEntries(entries: LogEntry[], options: FilterOptions): FilterResult {
  const { query, isRegex, caseSensitive, levels } = options;

  const byLevel = levels && levels.size > 0 ? entries.filter((e) => levels.has(e.level)) : entries;

  if (!query.trim()) {
    return { matched: byLevel, total: byLevel.length, error: null };
  }

  if (isRegex) {
    let regex: RegExp;
    try {
      regex = new RegExp(query, caseSensitive ? "g" : "gi");
    } catch (err) {
      return { matched: [], total: 0, error: (err as Error).message };
    }
    const matched = byLevel.filter((e) => {
      regex.lastIndex = 0;
      return regex.test(e.searchText);
    });
    return { matched, total: matched.length, error: null };
  }

  const needle = caseSensitive ? query : query.toLowerCase();
  const matched = byLevel.filter((e) => {
    const haystack = caseSensitive ? e.searchText : e.searchText.toLowerCase();
    return haystack.includes(needle);
  });
  return { matched, total: matched.length, error: null };
}
