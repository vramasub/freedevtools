"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/download";
import { getImageDimensions, resizeImageFile } from "@/lib/converters/imageOps";

interface Result {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
  size: number;
}

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setError(null);
    setResult(null);
    try {
      const dims = await getImageDimensions(selected);
      setFile(selected);
      setOriginal(dims);
      setWidth(dims.width);
      setHeight(dims.height);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function handleWidthChange(value: number) {
    setWidth(value);
    if (lockAspect && original) {
      setHeight(Math.round((value / original.width) * original.height));
    }
  }

  function handleHeightChange(value: number) {
    setHeight(value);
    if (lockAspect && original) {
      setWidth(Math.round((value / original.height) * original.width));
    }
  }

  async function handleResize() {
    if (!file || width < 1 || height < 1) return;
    setIsProcessing(true);
    setError(null);
    try {
      const mime = file.type || "image/png";
      const { blob, width: w, height: h } = await resizeImageFile(file, width, height, mime);
      const base = file.name.replace(/\.[^.]+$/, "");
      const ext = mime.split("/")[1] ?? "png";
      setResult({ blob, filename: `${base}-${w}x${h}.${ext}`, width: w, height: h, size: blob.size });
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
        accept="image/png,image/jpeg,image/webp"
        onFiles={handleFiles}
        label="Drop a PNG, JPG, or WebP image here, or click to browse"
        hint="Processed locally — never uploaded."
      />

      {original && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-500">
            Original size: {original.width} &times; {original.height}px
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-slate-700">
                Width (px)
              </label>
              <input
                id="width"
                type="number"
                min={1}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="mt-1 w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-700">
                Height (px)
              </label>
              <input
                id="height"
                type="number"
                min={1}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="mt-1 w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="accent-indigo-600"
              />
              Lock aspect ratio
            </label>
          </div>
          <button
            type="button"
            onClick={handleResize}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isProcessing && <Loader2 size={16} className="animate-spin" />}
            Resize
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              {result.width} &times; {result.height}px &middot; {formatBytes(result.size)}
            </p>
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
