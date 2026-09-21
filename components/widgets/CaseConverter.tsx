"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

// Splits text into normalized lowercase words for the programmatic cases (camel, snake,
// etc.) — handles spaces, existing camelCase boundaries, and punctuation/underscores/hyphens.
function toWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

function titleCase(input: string): string {
  return input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function sentenceCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function buildConversions(input: string) {
  const words = toWords(input);
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  return [
    { label: "UPPERCASE", value: input.toUpperCase() },
    { label: "lowercase", value: input.toLowerCase() },
    { label: "Title Case", value: titleCase(input) },
    { label: "Sentence case", value: sentenceCase(input) },
    { label: "camelCase", value: words.map((w, i) => (i === 0 ? w : cap(w))).join("") },
    { label: "PascalCase", value: words.map(cap).join("") },
    { label: "snake_case", value: words.join("_") },
    { label: "kebab-case", value: words.join("-") },
    { label: "CONSTANT_CASE", value: words.join("_").toUpperCase() },
  ];
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const conversions = useMemo(() => buildConversions(text), [text]);

  async function copy(label: string, value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <label htmlFor="cc-input" className="block text-sm font-medium text-[#14140F]/70">
        Your text
      </label>
      <textarea
        id="cc-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to convert…"
        className="mt-1 h-28 w-full resize-y rounded-lg border border-[#14140F]/15 p-3 text-sm text-[#14140F] focus:border-[#BE185D] focus:outline-none focus:ring-1 focus:ring-[#BE185D]"
      />

      <div className="mt-5 space-y-2">
        {conversions.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] px-4 py-2.5"
          >
            <span className="w-32 shrink-0 text-xs font-medium text-[#14140F]/55">{c.label}</span>
            <span className="min-w-0 flex-1 truncate text-sm text-[#14140F]">
              {c.value || <span className="text-[#14140F]/30">—</span>}
            </span>
            <button
              type="button"
              onClick={() => copy(c.label, c.value)}
              aria-label={`Copy ${c.label}`}
              className="shrink-0 text-[#14140F]/40 hover:text-[#BE185D] disabled:opacity-40"
              disabled={!c.value}
            >
              {copied === c.label ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
