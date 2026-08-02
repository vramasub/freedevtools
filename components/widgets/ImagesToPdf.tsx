"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Download, ImageIcon, Loader2, X } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/download";
import { imagesToPdf } from "@/lib/converters/pdfOps";

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function addFiles(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleConvert() {
    setIsProcessing(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(files);
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "images.pdf");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <FileDropzone
        accept="image/png,image/jpeg"
        multiple
        onFiles={addFiles}
        label="Drop PNG or JPG images here, or click to browse"
        hint="Add one or more images. Processed locally — never uploaded."
      />

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
            >
              <span className="flex items-center gap-2 truncate text-sm text-slate-700">
                <ImageIcon size={16} className="shrink-0 text-slate-400" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === files.length - 1}
                  aria-label="Move down"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label="Remove"
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConvert}
        disabled={files.length === 0 || isProcessing}
        className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Create PDF
      </button>
    </div>
  );
}
