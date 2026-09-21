"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseHex(hex: string): Rgb | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function toHex({ r, g, b }: Rgb): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#4438CA");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = parseHex(hex);
  const valid = rgb !== null;
  const normalizedHex = valid ? toHex(rgb) : "#000000";
  const hsl = valid ? rgbToHsl(rgb) : { h: 0, s: 0, l: 0 };

  const values = valid
    ? [
        { label: "HEX", value: normalizedHex.toUpperCase() },
        { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      ]
    : [];

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="h-32 w-full shrink-0 rounded-lg border border-[#14140F]/10 sm:w-32"
          style={{ backgroundColor: valid ? normalizedHex : "transparent" }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={normalizedHex}
              onChange={(e) => setHex(e.target.value)}
              aria-label="Pick a color"
              className="h-11 w-14 shrink-0 cursor-pointer rounded border border-[#14140F]/15 bg-white"
            />
            <div className="flex-1">
              <label htmlFor="cp-hex" className="block text-xs font-medium text-[#14140F]/55">
                HEX value
              </label>
              <input
                id="cp-hex"
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#4438CA"
                className="mt-1 w-full rounded-lg border border-[#14140F]/15 px-3 py-1.5 font-mono text-sm focus:border-[#0E7A5F] focus:outline-none focus:ring-1 focus:ring-[#0E7A5F]"
              />
            </div>
          </div>
          {!valid && (
            <p className="mt-2 text-sm text-[#DC2626]">
              Enter a valid hex color, e.g. #4438CA or #abc.
            </p>
          )}
        </div>
      </div>

      {valid && (
        <div className="mt-5 space-y-2">
          {values.map((v) => (
            <div
              key={v.label}
              className="flex items-center gap-3 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] px-4 py-2.5"
            >
              <span className="w-12 shrink-0 text-xs font-medium text-[#14140F]/55">{v.label}</span>
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-[#14140F]">{v.value}</code>
              <button
                type="button"
                onClick={() => copy(v.label, v.value)}
                aria-label={`Copy ${v.label} value`}
                className="shrink-0 text-[#14140F]/40 hover:text-[#0E7A5F]"
              >
                {copied === v.label ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
