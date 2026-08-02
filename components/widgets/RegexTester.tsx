"use client";

import { useMemo, useState } from "react";

const FLAG_OPTIONS = [
  { flag: "g", label: "Global (g)" },
  { flag: "i", label: "Ignore case (i)" },
  { flag: "m", label: "Multiline (m)" },
  { flag: "s", label: "Dot all (s)" },
];

const SAMPLE_PATTERN = "\\b[\\w.+-]+@[\\w-]+\\.[\\w.-]+\\b";
const SAMPLE_TEXT = "Contact us at hello@example.com or support@free-devtool.dev for help.";

interface MatchInfo {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g", "i"]);
  const [testText, setTestText] = useState("");

  function toggleFlag(flag: string) {
    setFlags((prev) => (prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]));
  }

  const { error, matches, segments } = useMemo(() => {
    if (!pattern) {
      return { error: null, matches: [] as MatchInfo[], segments: null };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags.join(""));
    } catch (err) {
      return { error: (err as Error).message, matches: [] as MatchInfo[], segments: null };
    }

    const found: MatchInfo[] = [];
    if (flags.includes("g")) {
      for (const m of testText.matchAll(regex)) {
        found.push({ match: m[0], index: m.index ?? 0, groups: m.slice(1).map((g) => g ?? "") });
        if (found.length > 500) break;
      }
    } else {
      const m = regex.exec(testText);
      if (m) {
        found.push({ match: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? "") });
      }
    }

    const parts: { text: string; isMatch: boolean }[] = [];
    let cursor = 0;
    for (const m of found) {
      if (m.index > cursor) parts.push({ text: testText.slice(cursor, m.index), isMatch: false });
      parts.push({ text: m.match || " ", isMatch: true });
      cursor = m.index + (m.match.length || 1);
    }
    if (cursor < testText.length) parts.push({ text: testText.slice(cursor), isMatch: false });

    return { error: null, matches: found, segments: parts };
  }, [pattern, flags, testText]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="regex-pattern" className="text-sm font-medium text-slate-700">
          Pattern
        </label>
        <button
          type="button"
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
          onClick={() => {
            setPattern(SAMPLE_PATTERN);
            setTestText(SAMPLE_TEXT);
          }}
        >
          Load sample
        </button>
      </div>
      <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        <span className="text-slate-400">/</span>
        <input
          id="regex-pattern"
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="[a-z]+"
          className="w-full bg-transparent px-1 py-2 font-mono text-sm text-slate-800 focus:outline-none"
          spellCheck={false}
        />
        <span className="text-slate-400">/{flags.join("")}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {FLAG_OPTIONS.map(({ flag, label }) => (
          <label key={flag} className="flex items-center gap-1.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={flags.includes(flag)}
              onChange={() => toggleFlag(flag)}
              className="accent-emerald-600"
            />
            {label}
          </label>
        ))}
      </div>

      <label htmlFor="regex-test-text" className="mt-4 block text-sm font-medium text-slate-700">
        Test string
      </label>
      <textarea
        id="regex-test-text"
        className="mt-1.5 h-32 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Paste text to test your pattern against…"
        spellCheck={false}
      />

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Invalid pattern: {error}
        </p>
      )}

      {!error && segments && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </p>
          <div className="mt-1.5 whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
            {segments.map((part, i) =>
              part.isMatch ? (
                <mark key={i} className="rounded bg-emerald-200 px-0.5 text-slate-900">
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>

          {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {matches.map((m, i) => (
                <li key={i}>
                  <span className="font-mono text-slate-800">&quot;{m.match}&quot;</span>
                  {m.groups.length > 0 && (
                    <>
                      {" "}
                      &rarr; groups: {m.groups.map((g, gi) => (
                        <code key={gi} className="mx-0.5 rounded bg-slate-100 px-1 font-mono text-xs">
                          {g || "(empty)"}
                        </code>
                      ))}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
