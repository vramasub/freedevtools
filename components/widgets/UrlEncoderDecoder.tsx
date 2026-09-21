"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Mode = "component" | "full";

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("component");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function encode() {
    setError(null);
    setOutput(mode === "component" ? encodeURIComponent(input) : encodeURI(input));
    setCopied(false);
  }

  function decode() {
    try {
      setOutput(mode === "component" ? decodeURIComponent(input) : decodeURI(input));
      setError(null);
    } catch {
      setError("This text isn't valid percent-encoding, so it can't be decoded.");
      setOutput("");
    }
    setCopied(false);
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-[#14140F]/70">Mode:</span>
        <label className="flex items-center gap-2 text-sm text-[#14140F]/70">
          <input
            type="radio"
            name="url-mode"
            checked={mode === "component"}
            onChange={() => setMode("component")}
            className="h-4 w-4 accent-[#0E7A5F]"
          />
          Component (a query value or path segment)
        </label>
        <label className="flex items-center gap-2 text-sm text-[#14140F]/70">
          <input
            type="radio"
            name="url-mode"
            checked={mode === "full"}
            onChange={() => setMode("full")}
            className="h-4 w-4 accent-[#0E7A5F]"
          />
          Full URL
        </label>
      </div>

      <label htmlFor="url-input" className="mt-4 block text-sm font-medium text-[#14140F]/70">
        Input
      </label>
      <textarea
        id="url-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste text or a URL here…"
        className="mt-1 h-28 w-full resize-y rounded-lg border border-[#14140F]/15 p-3 font-mono text-sm text-[#14140F] focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
      />

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={encode}
          className="rounded-lg bg-[#14140F] px-5 py-2.5 text-sm font-semibold text-[#FAF9F5] hover:bg-[#14140F]/85"
        >
          Encode
        </button>
        <button
          type="button"
          onClick={decode}
          className="rounded-lg border border-[#14140F]/20 px-5 py-2.5 text-sm font-semibold text-[#14140F] hover:bg-[#14140F]/5"
        >
          Decode
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="mt-5 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5]">
        <div className="flex items-center justify-between border-b border-[#14140F]/10 px-4 py-2">
          <span className="text-xs font-medium text-[#14140F]/55">Output</span>
          <button
            type="button"
            onClick={copy}
            disabled={!output}
            className="flex items-center gap-1 text-xs font-medium text-[#0E7A5F] hover:opacity-80 disabled:opacity-40"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all p-4 font-mono text-sm text-[#14140F]">
          {output || <span className="text-[#14140F]/30">Result will appear here.</span>}
        </pre>
      </div>
    </div>
  );
}
