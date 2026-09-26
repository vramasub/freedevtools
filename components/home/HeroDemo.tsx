"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Globe } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

interface DemoFrame {
  tool: string;
  inputLabel: string;
  input: string;
  outputLabel: string;
  renderOutput: (accent: string) => ReactNode;
  accent: string;
}

// Tokenizes a pretty-printed JSON string into key / string / number spans, so the demo
// output reads as real syntax-highlighted code rather than flat monospace text.
// Capture groups: 1 = key (quoted, followed by a colon), 2 = string value, 3 = number.
const JSON_TOKEN_RE = /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?)/g;

function renderJson(json: string, colors: { key: string; string: string; number: string }): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  for (const match of json.matchAll(JSON_TOKEN_RE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(json.slice(lastIndex, start));
    const [token, color] = match[1]
      ? [match[1], colors.key]
      : match[2]
        ? [match[2], colors.string]
        : [match[3], colors.number];
    nodes.push(
      <span key={i++} style={{ color }}>
        {token}
      </span>
    );
    lastIndex = start + match[0].length;
  }
  if (lastIndex < json.length) nodes.push(json.slice(lastIndex));
  return nodes;
}

// Representative of what each tool actually does — not literally computed live, since
// this is a hero demonstration rather than the tool itself (which is one click away).
const frames: DemoFrame[] = [
  {
    tool: "csv-to-json",
    inputLabel: "data.csv",
    input: "name,role,years\nAda Lovelace,Engineer,5",
    outputLabel: "data.json",
    renderOutput: (accent) =>
      renderJson('[\n  {\n    "name": "Ada Lovelace",\n    "role": "Engineer",\n    "years": 5\n  }\n]', {
        key: accent,
        string: "#0E7A5F",
        number: "#B5751A",
      }),
    accent: "#4438CA",
  },
  {
    tool: "compress-png",
    inputLabel: "screenshot.png",
    input: "2.4 MB",
    outputLabel: "screenshot.png",
    renderOutput: (accent) => (
      <>
        <span className="font-semibold text-[#14140F]">412 KB</span>
        <span className="text-[#14140F]/35">{"   "}</span>
        <span className="font-semibold" style={{ color: accent }}>
          (&minus;83%)
        </span>
      </>
    ),
    accent: "#E1502E",
  },
  {
    tool: "uuid-generator",
    inputLabel: "generate v4",
    input: "→",
    outputLabel: "uuid",
    renderOutput: (accent) =>
      "7d710cc4-a1cd-4a75-8cfe-26790893b2bd".split("-").map((segment, i, arr) => (
        <span key={i}>
          <span className="font-semibold" style={{ color: accent, opacity: i % 2 === 0 ? 1 : 0.6 }}>
            {segment}
          </span>
          {i < arr.length - 1 && <span className="text-[#14140F]/25">-</span>}
        </span>
      )),
    accent: "#0E7A5F",
  },
];

const FRAME_DURATION_MS = 3200;
const SWAP_MS = 180;

const displayHost = siteConfig.url.replace(/^https?:\/\//, "");

export default function HeroDemo() {
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Cross-fades the content panel between frames instead of swapping it instantly —
  // fade out the old frame, swap the data, fade the new one back in.
  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(() => setDisplayIndex(index), 0);
      return () => clearTimeout(t);
    }
    const fadeOut = setTimeout(() => setSwapping(true), 0);
    const swap = setTimeout(() => {
      setDisplayIndex(index);
      setSwapping(false);
    }, SWAP_MS);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  }, [index, reducedMotion]);

  const frame = frames[index];
  const displayFrame = frames[displayIndex];
  const monoStyle = { fontFamily: "var(--font-jetbrains-mono)" };

  return (
    <div className="relative w-full max-w-md">
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-[2.5rem] opacity-25 blur-3xl transition-colors duration-500"
        style={{ backgroundColor: frame.accent }}
      />
      <div className="w-full overflow-hidden rounded-2xl border border-[#14140F]/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-28px_rgba(20,20,15,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-[#14140F]/10 px-4 py-3">
          {frames.map((f, i) => (
            <button
              key={f.tool}
              type="button"
              aria-label={`Show ${f.tool} example`}
              onClick={() => setIndex(i)}
              className="h-2 w-2 rounded-full transition-opacity"
              style={{ backgroundColor: f.accent, opacity: i === index ? 1 : 0.25 }}
            />
          ))}
        </div>
        <div
          className="flex items-center gap-1.5 border-b border-[#14140F]/10 bg-[#FAF9F5] px-4 py-2"
          style={monoStyle}
        >
          <Globe size={12} className="shrink-0 text-[#14140F]/35" />
          <span className="truncate text-xs text-[#14140F]/45">
            {displayHost}/tools/{displayFrame.tool}
          </span>
        </div>
        <div
          className="space-y-3 p-5 text-sm transition-opacity duration-150 ease-out"
          style={{ ...monoStyle, opacity: swapping ? 0 : 1 }}
        >
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#14140F]/40">
              {displayFrame.inputLabel}
            </div>
            <pre className="mt-1 whitespace-pre-wrap break-words text-[#14140F]">{displayFrame.input}</pre>
          </div>
          <div className="flex items-center gap-2 text-[#14140F]/25">
            <span className="h-px flex-1 bg-[#14140F]/10" />
            <span aria-hidden="true">&darr;</span>
            <span className="h-px flex-1 bg-[#14140F]/10" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#14140F]/40">
              {displayFrame.outputLabel}
            </div>
            <pre className="mt-1 whitespace-pre-wrap break-words font-medium text-[#14140F]/40">
              {displayFrame.renderOutput(displayFrame.accent)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
