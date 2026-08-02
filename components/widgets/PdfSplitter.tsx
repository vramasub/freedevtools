"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob } from "@/lib/download";
import { splitPdf } from "@/lib/converters/pdfOps";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setError(null);
    setPageCount(null);
  }

  async function handleSplit() {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const pages = await splitPdf(file);
      setPageCount(pages.length);
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const page of pages) {
        zip.file(page.filename, page.bytes);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(zipBlob, `${base}-pages.zip`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <FileDropzone
        accept="application/pdf"
        onFiles={handleFiles}
        label="Drop a PDF file here, or click to browse"
        hint="Processed locally — never uploaded."
      />

      {file && (
        <p className="mt-4 text-sm text-slate-600">
          Selected: <span className="font-medium text-slate-900">{file.name}</span>
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {pageCount !== null && !error && (
        <p className="mt-4 text-sm text-emerald-700">
          Split into {pageCount} pages and downloaded as a zip.
        </p>
      )}

      <button
        type="button"
        onClick={handleSplit}
        disabled={!file || isProcessing}
        className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Split & Download Zip
      </button>
    </div>
  );
}
