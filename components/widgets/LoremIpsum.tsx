"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { downloadText } from "@/lib/download";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

const LEAD = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

type Unit = "paragraphs" | "sentences" | "words";

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function makeSentence(): string {
  const length = 8 + Math.floor(Math.random() * 8);
  const parts: string[] = [];
  for (let i = 0; i < length; i++) parts.push(randomWord());
  // Insert a comma somewhere in the middle for a more natural rhythm.
  if (length > 6) parts[Math.floor(length / 2)] += ",";
  const sentence = parts.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function makeParagraph(): string {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, makeSentence).join(" ");
}

function generate(amount: number, unit: Unit, startWithLorem: boolean): string {
  if (unit === "words") {
    const words = Array.from({ length: amount }, randomWord);
    if (startWithLorem) words.splice(0, Math.min(2, amount), "lorem", "ipsum");
    const text = words.join(" ");
    return text.charAt(0).toUpperCase() + text.slice(1) + ".";
  }
  if (unit === "sentences") {
    const sentences = Array.from({ length: amount }, makeSentence);
    if (startWithLorem && sentences.length > 0) sentences[0] = LEAD + ".";
    return sentences.join(" ");
  }
  const paragraphs = Array.from({ length: amount }, makeParagraph);
  if (startWithLorem && paragraphs.length > 0) {
    paragraphs[0] = LEAD + ", " + paragraphs[0].charAt(0).toLowerCase() + paragraphs[0].slice(1);
  }
  return paragraphs.join("\n\n");
}

export default function LoremIpsum() {
  const [amount, setAmount] = useState(3);
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  // Populated after mount rather than in the initial state, so the random text isn't
  // generated during render (which would differ between server and client and break
  // hydration). The server renders an empty output area; the client fills it on mount.
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOutput(generate(3, "paragraphs", true)), 0);
    return () => clearTimeout(t);
  }, []);

  function handleGenerate() {
    setOutput(generate(Math.max(1, Math.min(amount, 100)), unit, startWithLorem));
    setCopied(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="li-amount" className="block text-sm font-medium text-[#14140F]/70">
            How many?
          </label>
          <input
            id="li-amount"
            type="number"
            min={1}
            max={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-24 rounded-lg border border-[#14140F]/15 px-3 py-1.5 text-sm focus:border-[#BE185D] focus:outline-none focus:ring-1 focus:ring-[#BE185D]"
          />
        </div>
        <div>
          <label htmlFor="li-unit" className="block text-sm font-medium text-[#14140F]/70">
            Unit
          </label>
          <select
            id="li-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="mt-1 rounded-lg border border-[#14140F]/15 px-3 py-1.5 text-sm focus:border-[#BE185D] focus:outline-none focus:ring-1 focus:ring-[#BE185D]"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pb-1.5 text-sm text-[#14140F]/70">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="h-4 w-4 rounded border-[#14140F]/30 accent-[#BE185D]"
          />
          Start with &ldquo;Lorem ipsum…&rdquo;
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-lg bg-[#14140F] px-5 py-2.5 text-sm font-semibold text-[#FAF9F5] hover:bg-[#14140F]/85"
        >
          <RefreshCw size={16} />
          Generate
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5]">
        <div className="flex items-center justify-end gap-3 border-b border-[#14140F]/10 px-4 py-2">
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 text-xs font-medium text-[#BE185D] hover:opacity-80"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => downloadText(output, "lorem-ipsum.txt")}
            className="flex items-center gap-1 text-xs font-medium text-[#BE185D] hover:opacity-80"
          >
            <Download size={12} />
            Download
          </button>
        </div>
        <div className="max-h-96 space-y-4 overflow-y-auto p-4 text-sm leading-7 text-[#14140F]/80">
          {output.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
