"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/download";
import { reencodeImage } from "@/lib/converters/imageOps";

type ImgFormat = "png" | "jpeg" | "webp";

const formatMime: Record<ImgFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

const formatExt: Record<ImgFormat, string> = {
  png: "png",
  jpeg: "jpg",
  webp: "webp",
};

const formatLabel: Record<ImgFormat, string> = {
  png: "PNG",
  jpeg: "JPG",
  webp: "WebP",
};

interface Result {
  blob: Blob;
  filename: string;
  size: number;
}

export default function ImageConverter({ from, to }: { from?: ImgFormat; to?: ImgFormat }) {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImgFormat>(to ?? "webp");
  const [quality, setQuality] = useState(0.85);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const accept = from ? formatMime[from] : "image/png,image/jpeg,image/webp";
  const effectiveTarget = to ?? targetFormat;

  async function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    await convert(selected, effectiveTarget, quality);
  }

  async function convert(selected: File, format: ImgFormat, q: number) {
    setIsProcessing(true);
    setError(null);
    try {
      const mime = formatMime[format];
      const { blob } = await reencodeImage(selected, mime, format === "png" ? undefined : q);
      const base = selected.name.replace(/\.[^.]+$/, "");
      setResult({ blob, filename: `${base}.${formatExt[format]}`, size: blob.size });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <FileDropzone
        accept={accept}
        onFiles={handleFiles}
        label={from ? `Drop a ${formatLabel[from]} image here, or click to browse` : "Drop an image here, or click to browse"}
        hint="Processed locally — never uploaded."
      />

      {!to && (
        <div className="mt-4">
          <label htmlFor="target-format" className="block text-sm font-medium text-slate-700">
            Convert to
          </label>
          <select
            id="target-format"
            value={targetFormat}
            onChange={(e) => {
              const format = e.target.value as ImgFormat;
              setTargetFormat(format);
              if (file) convert(file, format, quality);
            }}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {(Object.keys(formatLabel) as ImgFormat[])
              .filter((f) => f !== from)
              .map((f) => (
                <option key={f} value={f}>
                  {formatLabel[f]}
                </option>
              ))}
          </select>
        </div>
      )}

      {effectiveTarget !== "png" && (
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
              if (file) convert(file, effectiveTarget, q);
            }}
            className="mt-1 w-full accent-indigo-600"
          />
        </div>
      )}

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
            <p className="text-sm text-slate-700">{formatBytes(result.size)}</p>
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
