"use client";

import { useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

const AMBIGUOUS = new Set("O0oIl1|`");

interface Options {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

function buildPool(opts: Options): string {
  let pool = "";
  if (opts.lowercase) pool += SETS.lowercase;
  if (opts.uppercase) pool += SETS.uppercase;
  if (opts.numbers) pool += SETS.numbers;
  if (opts.symbols) pool += SETS.symbols;
  if (opts.excludeAmbiguous) {
    pool = pool
      .split("")
      .filter((c) => !AMBIGUOUS.has(c))
      .join("");
  }
  return pool;
}

// Uses the browser's cryptographically secure RNG, with rejection sampling to avoid the
// modulo bias a plain `% pool.length` would introduce.
function generatePassword(opts: Options): string {
  const pool = buildPool(opts);
  if (!pool) return "";
  const max = Math.floor(256 / pool.length) * pool.length;
  const out: string[] = [];
  const buf = new Uint8Array(1);
  while (out.length < opts.length) {
    crypto.getRandomValues(buf);
    if (buf[0] < max) out.push(pool[buf[0] % pool.length]);
  }
  return out.join("");
}

function strengthLabel(password: string, poolSize: number): { label: string; pct: number; color: string } {
  if (!password) return { label: "—", pct: 0, color: "#14140F" };
  const entropy = password.length * Math.log2(Math.max(poolSize, 1));
  if (entropy < 40) return { label: "Weak", pct: 25, color: "#DC2626" };
  if (entropy < 60) return { label: "Fair", pct: 50, color: "#B5751A" };
  if (entropy < 80) return { label: "Strong", pct: 75, color: "#0E7A5F" };
  return { label: "Very strong", pct: 100, color: "#0E7A5F" };
}

const DEFAULT_OPTS: Options = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTS);
  // Generated after mount, not in the initial state, so the server-rendered HTML (empty)
  // matches the client's first render — generating a random value during render would
  // produce different output on server vs client and break hydration.
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPassword(generatePassword(DEFAULT_OPTS)), 0);
    return () => clearTimeout(t);
  }, []);

  function regenerate(next: Options) {
    const pool = buildPool(next);
    if (!pool) {
      setError("Select at least one character type.");
      setPassword("");
      return;
    }
    setError(null);
    setPassword(generatePassword(next));
    setCopied(false);
  }

  function update(patch: Partial<Options>) {
    const next = { ...opts, ...patch };
    setOpts(next);
    regenerate(next);
  }

  async function copy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const strength = strengthLabel(password, buildPool(opts).length);

  const toggles: { key: keyof Options; label: string }[] = [
    { key: "lowercase", label: "Lowercase (a-z)" },
    { key: "uppercase", label: "Uppercase (A-Z)" },
    { key: "numbers", label: "Numbers (0-9)" },
    { key: "symbols", label: "Symbols (!@#$)" },
    { key: "excludeAmbiguous", label: "Exclude look-alikes (O/0, l/1)" },
  ];

  return (
    <div className="rounded-xl border border-[#14140F]/10 bg-white p-4 sm:p-6">
      <div className="flex items-center gap-3 rounded-lg border border-[#14140F]/10 bg-[#FAF9F5] px-4 py-3">
        <code className="min-w-0 flex-1 truncate font-mono text-lg text-[#14140F]">
          {password || <span className="text-[#14140F]/30">Select a character type…</span>}
        </code>
        <button
          type="button"
          onClick={copy}
          disabled={!password}
          aria-label="Copy password"
          className="shrink-0 text-[#14140F]/40 hover:text-[#0E7A5F] disabled:opacity-40"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
        <button
          type="button"
          onClick={() => regenerate(opts)}
          aria-label="Generate new password"
          className="shrink-0 text-[#14140F]/40 hover:text-[#0E7A5F]"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#14140F]/10">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${strength.pct}%`, backgroundColor: strength.color }}
          />
        </div>
        <span className="w-24 text-right text-xs font-medium" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      {error && <p className="mt-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label htmlFor="pw-length" className="text-sm font-medium text-[#14140F]/70">
            Length
          </label>
          <span className="font-mono text-sm text-[#14140F]">{opts.length}</span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={4}
          max={64}
          value={opts.length}
          onChange={(e) => update({ length: Number(e.target.value) })}
          className="mt-2 w-full accent-[#0E7A5F]"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {toggles.map((t) => (
          <label key={t.key} className="flex items-center gap-2 text-sm text-[#14140F]/70">
            <input
              type="checkbox"
              checked={opts[t.key] as boolean}
              onChange={(e) => update({ [t.key]: e.target.checked })}
              className="h-4 w-4 rounded border-[#14140F]/30 accent-[#0E7A5F]"
            />
            {t.label}
          </label>
        ))}
      </div>
    </div>
  );
}
