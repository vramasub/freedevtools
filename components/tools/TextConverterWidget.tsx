"use client";

import { useState } from "react";
import { Check, Copy, Download, Upload, Wand2 } from "lucide-react";
import { downloadText } from "@/lib/download";

interface TextConverterWidgetProps {
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder?: string;
  sample?: string;
  uploadAccept?: string;
  outputFilename: string;
  outputMime?: string;
  convert: (input: string) => string;
}

export default function TextConverterWidget({
  inputLabel,
  outputLabel,
  inputPlaceholder,
  sample,
  uploadAccept,
  outputFilename,
  outputMime = "text/plain",
  convert,
}: TextConverterWidgetProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    try {
      const result = convert(input);
      setOutput(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setOutput("");
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="converter-input" className="text-sm font-medium text-slate-700">
              {inputLabel}
            </label>
            <div className="flex items-center gap-3">
              {sample && (
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  onClick={() => setInput(sample)}
                >
                  Load sample
                </button>
              )}
              {uploadAccept && (
                <label className="flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  <Upload size={12} />
                  Upload file
                  <input
                    type="file"
                    accept={uploadAccept}
                    className="sr-only"
                    onChange={handleUpload}
                  />
                </label>
              )}
            </div>
          </div>
          <textarea
            id="converter-input"
            className="h-64 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="converter-output" className="text-sm font-medium text-slate-700">
              {outputLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!output}
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                disabled={!output}
                onClick={() => downloadText(output, outputFilename, outputMime)}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <Download size={12} />
                Download
              </button>
            </div>
          </div>
          <textarea
            id="converter-output"
            readOnly
            className="h-64 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:outline-none"
            value={output}
            placeholder="Output will appear here"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConvert}
        disabled={!input.trim()}
        className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Wand2 size={16} />
        Convert
      </button>
    </div>
  );
}
