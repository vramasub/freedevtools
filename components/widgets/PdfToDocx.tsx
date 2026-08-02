"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob } from "@/lib/download";
import { pdfToDocx } from "@/lib/converters/pdfToDocx";

export default function PdfToDocx() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setError(null);
    setDone(false);
  }

  async function handleConvert() {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setDone(false);
    try {
      const blob = await pdfToDocx(file);
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}.docx`);
      setDone(true);
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

      {done && !error && (
        <p className="mt-4 text-sm text-emerald-700">Converted and downloaded as a Word document.</p>
      )}

      <button
        type="button"
        onClick={handleConvert}
        disabled={!file || isProcessing}
        className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Convert to Word
      </button>
    </div>
  );
}
