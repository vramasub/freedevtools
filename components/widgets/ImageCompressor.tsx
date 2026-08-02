"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/download";
import { compressPng, reencodeImage } from "@/lib/converters/imageOps";

interface Result {
  url: string;
  blob: Blob;
  filename: string;
  originalSize: number;
  newSize: number;
}

export default function ImageCompressor({ format }: { format: "png" | "jpeg" }) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const accept = format === "png" ? "image/png" : "image/jpeg";

  async function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    await process(selected, quality);
  }

  async function process(selected: File, q: number) {
    setIsProcessing(true);
    setError(null);
    try {
      const { blob } =
        format === "png"
          ? await compressPng(selected, q)
          : await reencodeImage(selected, "image/jpeg", q);
      const url = URL.createObjectURL(blob);
      const base = selected.name.replace(/\.[^.]+$/, "");
      setResult({
        url,
        blob,
        filename: `${base}-compressed.${format === "png" ? "png" : "jpg"}`,
        originalSize: selected.size,
        newSize: blob.size,
      });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  }

  const savings = result
    ? Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100))
    : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <FileDropzone
        accept={accept}
        onFiles={handleFiles}
        label={`Drop a ${format.toUpperCase()} image here, or click to browse`}
        hint="Processed locally — never uploaded."
      />

      <div className="mt-4">
        <label htmlFor="quality" className="flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Quality</span>
          <span>{Math.round(quality * 100)}%</span>
        </label>
        <input
          id="quality"
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={quality}
          onChange={(e) => {
            const q = Number(e.target.value);
            setQuality(q);
            if (file) process(file, q);
          }}
          className="mt-1 w-full accent-indigo-600"
        />
        {format === "png" && (
          <p className="mt-1 text-xs text-slate-500">
            Lower quality reduces the number of colors used, which can significantly shrink file
            size for illustrations, icons, and screenshots.
          </p>
        )}
      </div>

      {isProcessing && (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          Processing…
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && !isProcessing && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-700">
              <p>
                {formatBytes(result.originalSize)} &rarr;{" "}
                <span className="font-semibold text-slate-900">{formatBytes(result.newSize)}</span>
              </p>
              <p className={savings > 0 ? "text-emerald-700" : "text-slate-500"}>
                {savings > 0 ? `${savings}% smaller` : "No further reduction possible"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadBlob(result.blob, result.filename)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
