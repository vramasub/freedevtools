"use client";

import { useMemo, useState } from "react";

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  // Average adult reading speed ≈ 200 words per minute.
  const readingMinutes = words / 200;
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
}

function formatReadingTime(minutes: number): string {
  if (minutes === 0) return "0 sec";
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  return `${Math.round(minutes)} min`;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  const cards = [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Characters", value: stats.characters.toLocaleString() },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Reading time", value: formatReadingTime(stats.readingMinutes) },
  ];

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] px-4 py-3">
            <div className="text-2xl font-semibold text-[#14140F]">{card.value}</div>
            <div className="mt-0.5 text-xs text-[#14140F]/55">{card.label}</div>
          </div>
        ))}
      </div>

      <label htmlFor="wc-input" className="mt-5 block text-sm font-medium text-[#14140F]/70">
        Your text
      </label>
      <textarea
        id="wc-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        className="mt-1 h-64 w-full resize-y rounded-lg border border-[#14140F]/15 p-3 text-sm text-[#14140F] focus:border-[#BE185D] focus:outline-none focus:ring-1 focus:ring-[#BE185D]"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => setText("")}
          className="text-xs font-medium text-[#14140F]/50 hover:text-[#14140F]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
