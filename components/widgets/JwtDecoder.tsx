"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { decodeJwt } from "@/lib/converters/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzM1Njg5NjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function formatClaimDate(value: unknown): string | null {
  if (typeof value !== "number") return null;
  return new Date(value * 1000).toLocaleString();
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { data: decodeJwt(token), error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }, [token]);

  const payload = result?.data?.payload as Record<string, unknown> | undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="jwt-input" className="text-sm font-medium text-slate-700">
          JWT
        </label>
        <button
          type="button"
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
          onClick={() => setToken(SAMPLE)}
        >
          Load sample
        </button>
      </div>
      <textarea
        id="jwt-input"
        className="h-28 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        placeholder="eyJhbGciOiJIUzI1NiIs..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
        spellCheck={false}
      />

      {result?.error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {result.error}
        </p>
      )}

      {result?.data && (
        <div className="mt-4 space-y-4">
          {payload && (formatClaimDate(payload.exp) || formatClaimDate(payload.iat)) && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {formatClaimDate(payload.iat) && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-600" />
                  Issued: {formatClaimDate(payload.iat)}
                </span>
              )}
              {formatClaimDate(payload.exp) && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-600" />
                  Expires: {formatClaimDate(payload.exp)}
                </span>
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-slate-700">Header</p>
            <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
              {JSON.stringify(result.data.header, null, 2)}
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Payload</p>
            <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
              {JSON.stringify(result.data.payload, null, 2)}
            </pre>
          </div>

          <p className="text-xs text-slate-500">
            Signature is shown for reference only — verifying it requires the secret or public key,
            which this tool never asks for.
          </p>
        </div>
      )}
    </div>
  );
}
