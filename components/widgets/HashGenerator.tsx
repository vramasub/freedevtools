"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { hashFile, hashText, type HashResults } from "@/lib/converters/hashOps";

const ALGORITHMS: { key: keyof HashResults; label: string }[] = [
  { key: "md5", label: "MD5" },
  { key: "sha1", label: "SHA-1" },
  { key: "sha256", label: "SHA-256" },
  { key: "sha512", label: "SHA-512" },
];

export default function HashGenerator() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<HashResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "text") return;
    const handle = setTimeout(async () => {
      if (!text) {
        setResults(null);
        return;
      }
      setIsProcessing(true);
      const hashes = await hashText(text);
      setResults(hashes);
      setIsProcessing(false);
    }, 200);
    return () => clearTimeout(handle);
  }, [text, mode]);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setIsProcessing(true);
    const hashes = await hashFile(file);
    setResults(hashes);
    setIsProcessing(false);
  }

  async function copy(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex gap-2">
        {(["text", "file"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setResults(null);
            }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              mode === m ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m === "text" ? "Hash text" : "Hash file"}
          </button>
        ))}
      </div>

      {mode === "text" ? (
        <textarea
          className="mt-4 h-32 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Type or paste text to hash…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div className="mt-4">
          <FileDropzone accept="*" onFiles={handleFiles} hint="Processed locally — never uploaded." />
          {fileName && <p className="mt-2 text-sm text-slate-600">Selected: {fileName}</p>}
        </div>
      )}

      {isProcessing && (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          Hashing…
        </p>
      )}

      {results && !isProcessing && (
        <div className="mt-5 space-y-3">
          {ALGORITHMS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => copy(key, results[key])}
                  className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  {copiedKey === key ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === key ? "Copied" : "Copy"}
                </button>
              </div>
              <code className="mt-1 block break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
                {results[key]}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
