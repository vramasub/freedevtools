"use client";

import { useEffect, useState } from "react";

interface DemoFrame {
  tool: string;
  inputLabel: string;
  input: string;
  outputLabel: string;
  output: string;
  accent: string;
}

// Representative of what each tool actually does — not literally computed live, since
// this is a hero demonstration rather than the tool itself (which is one click away).
const frames: DemoFrame[] = [
  {
    tool: "csv-to-json",
    inputLabel: "data.csv",
    input: "name,role,years\nAda Lovelace,Engineer,5",
    outputLabel: "data.json",
    output: '[\n  {\n    "name": "Ada Lovelace",\n    "role": "Engineer",\n    "years": 5\n  }\n]',
    accent: "#4438CA",
  },
  {
    tool: "compress-png",
    inputLabel: "screenshot.png",
    input: "2.4 MB",
    outputLabel: "screenshot.png",
    output: "412 KB   (−83%)",
    accent: "#E1502E",
  },
  {
    tool: "uuid-generator",
    inputLabel: "generate v4",
    input: "→",
    outputLabel: "uuid",
    output: "7d710cc4-a1cd-4a75-8cfe-26790893b2bd",
    accent: "#0E7A5F",
  },
];

const FRAME_DURATION_MS = 3200;

export default function HeroDemo() {
  const [index, setIndex] = useState(0);
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

  const frame = frames[index];
  const monoStyle = { fontFamily: "var(--font-jetbrains-mono)" };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#14140F]/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-28px_rgba(20,20,15,0.35)]">
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
        <span className="ml-2 truncate text-xs text-[#14140F]/50" style={monoStyle}>
          {frame.tool}
        </span>
      </div>
      <div className="space-y-3 p-5 text-sm" style={monoStyle}>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#14140F]/40">{frame.inputLabel}</div>
          <pre className="mt-1 whitespace-pre-wrap break-words text-[#14140F]">{frame.input}</pre>
        </div>
        <div className="flex items-center gap-2 text-[#14140F]/25">
          <span className="h-px flex-1 bg-[#14140F]/10" />
          <span aria-hidden="true">&darr;</span>
          <span className="h-px flex-1 bg-[#14140F]/10" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#14140F]/40">{frame.outputLabel}</div>
          <pre className="mt-1 whitespace-pre-wrap break-words font-medium" style={{ color: frame.accent }}>
            {frame.output}
          </pre>
        </div>
      </div>
    </div>
  );
}
