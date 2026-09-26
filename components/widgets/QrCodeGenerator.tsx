"use client";

import { useEffect, useRef, useState } from "react";
import { Download, QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "qrcode";
import { downloadBlob } from "@/lib/download";

type ErrorCorrection = "L" | "M" | "Q" | "H";

interface Options {
  size: number;
  errorCorrection: ErrorCorrection;
  foreground: string;
  background: string;
  margin: number;
}

const DEFAULT_OPTS: Options = {
  size: 320,
  errorCorrection: "M",
  foreground: "#14140F",
  background: "#FFFFFF",
  margin: 2,
};

const EC_LEVELS: { key: ErrorCorrection; label: string; hint: string }[] = [
  { key: "L", label: "L", hint: "~7% recovery" },
  { key: "M", label: "M", hint: "~15% recovery" },
  { key: "Q", label: "Q", hint: "~25% recovery" },
  { key: "H", label: "H", hint: "~30% recovery" },
];

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://freedevtool.co.uk");
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTS);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const t = setTimeout(() => {
      if (!text.trim()) {
        const ctx = canvas.getContext("2d");
        canvas.width = opts.size;
        canvas.height = opts.size;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        setError(null);
        return;
      }

      QRCode.toCanvas(canvas, text, {
        width: opts.size,
        margin: opts.margin,
        errorCorrectionLevel: opts.errorCorrection,
        color: { dark: opts.foreground, light: opts.background },
      })
        .then(() => setError(null))
        .catch((err: Error) => setError(err.message));
    }, 150);

    return () => clearTimeout(t);
  }, [text, opts]);

  async function downloadPng() {
    if (!text.trim() || error) return;
    const dataUrl = await QRCode.toDataURL(text, {
      width: opts.size,
      margin: opts.margin,
      errorCorrectionLevel: opts.errorCorrection,
      color: { dark: opts.foreground, light: opts.background },
    });
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, "qr-code.png");
  }

  async function downloadSvg() {
    if (!text.trim() || error) return;
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: opts.margin,
      errorCorrectionLevel: opts.errorCorrection,
      color: { dark: opts.foreground, light: opts.background },
    });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  }

  function update(patch: Partial<Options>) {
    setOpts((prev) => ({ ...prev, ...patch }));
  }

  const hasCode = text.trim().length > 0 && !error;

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <label htmlFor="qr-text" className="block text-sm font-medium text-[#14140F]/70">
        Text or URL
      </label>
      <textarea
        id="qr-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://example.com"
        rows={3}
        className="mt-1.5 w-full resize-none rounded-lg border border-[#14140F]/15 px-3 py-2 font-mono text-sm focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
      />
      {error && <p className="mt-2 text-sm text-[#DC2626]">{error}</p>}

      <div className="mt-5 flex flex-col items-center gap-4 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] py-8">
        {hasCode ? (
          <canvas ref={canvasRef} className="max-w-full rounded" />
        ) : (
          <div
            className="flex flex-col items-center gap-2 text-[#14140F]/30"
            style={{ width: opts.size, height: opts.size, maxWidth: "100%" }}
          >
            <QrCodeIcon size={48} />
            <span className="text-sm">Enter text to generate a QR code</span>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!hasCode}
            className="inline-flex items-center gap-2 rounded-lg bg-[#14140F] px-4 py-2 text-sm font-medium text-white hover:bg-[#14140F]/85 disabled:opacity-40"
          >
            <Download size={16} />
            PNG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            disabled={!hasCode}
            className="inline-flex items-center gap-2 rounded-lg border border-[#14140F]/15 bg-white px-4 py-2 text-sm font-medium text-[#14140F] hover:border-[#0E7A5F]/40 disabled:opacity-40"
          >
            <Download size={16} />
            SVG
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="qr-size" className="text-sm font-medium text-[#14140F]/70">
              Size
            </label>
            <span className="font-mono text-sm text-[#14140F]">{opts.size}px</span>
          </div>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={1024}
            step={8}
            value={opts.size}
            onChange={(e) => update({ size: Number(e.target.value) })}
            className="mt-2 w-full accent-[#0E7A5F]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="qr-margin" className="text-sm font-medium text-[#14140F]/70">
              Margin
            </label>
            <span className="font-mono text-sm text-[#14140F]">{opts.margin}</span>
          </div>
          <input
            id="qr-margin"
            type="range"
            min={0}
            max={10}
            value={opts.margin}
            onChange={(e) => update({ margin: Number(e.target.value) })}
            className="mt-2 w-full accent-[#0E7A5F]"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-[#14140F]/70">Error correction</span>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {EC_LEVELS.map((level) => (
              <button
                key={level.key}
                type="button"
                title={level.hint}
                onClick={() => update({ errorCorrection: level.key })}
                className={`rounded-lg border px-2 py-1.5 text-sm font-medium transition-colors ${
                  opts.errorCorrection === level.key
                    ? "border-[#0E7A5F] bg-[#0E7A5F]/10 text-[#0E7A5F]"
                    : "border-[#14140F]/15 text-[#14140F]/70 hover:border-[#0E7A5F]/40"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[#14140F]/70">Colors</span>
          <div className="mt-2 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#14140F]/70">
              <input
                type="color"
                value={opts.foreground}
                onChange={(e) => update({ foreground: e.target.value })}
                aria-label="Foreground color"
                className="h-9 w-9 cursor-pointer rounded border border-[#14140F]/15 bg-white"
              />
              Foreground
            </label>
            <label className="flex items-center gap-2 text-sm text-[#14140F]/70">
              <input
                type="color"
                value={opts.background}
                onChange={(e) => update({ background: e.target.value })}
                aria-label="Background color"
                className="h-9 w-9 cursor-pointer rounded border border-[#14140F]/15 bg-white"
              />
              Background
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
