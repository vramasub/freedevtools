"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { downloadText } from "@/lib/download";

const COUNT_OPTIONS = [1, 5, 10, 25, 50];

function generate(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  // Generated after mount, not in the initial state, so the random UUIDs aren't produced
  // during render — doing so gives the server and client different values and breaks
  // hydration. The server renders an empty list; the client fills it on mount.
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setUuids(generate(5)), 0);
    return () => clearTimeout(t);
  }, []);

  function handleGenerate() {
    setUuids(generate(count));
    setCopiedAll(false);
    setCopiedIndex(null);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  async function copyOne(index: number) {
    await navigator.clipboard.writeText(uuids[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="uuid-count" className="block text-sm font-medium text-slate-700">
            How many?
          </label>
          <select
            id="uuid-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Generate
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
          <span className="text-xs font-medium text-slate-500">
            {uuids.length} UUID{uuids.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyAll}
              className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              {copiedAll ? <Check size={12} /> : <Copy size={12} />}
              {copiedAll ? "Copied" : "Copy all"}
            </button>
            <button
              type="button"
              onClick={() => downloadText(uuids.join("\n"), "uuids.txt")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              <Download size={12} />
              Download
            </button>
          </div>
        </div>
        <ul className="max-h-80 divide-y divide-slate-200 overflow-y-auto">
          {uuids.map((uuid, index) => (
            <li key={`${uuid}-${index}`} className="flex items-center justify-between px-4 py-2">
              <code className="font-mono text-sm text-slate-800">{uuid}</code>
              <button
                type="button"
                onClick={() => copyOne(index)}
                aria-label="Copy this UUID"
                className="text-slate-400 hover:text-emerald-700"
              >
                {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
