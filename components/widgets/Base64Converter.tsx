"use client";

import { useState } from "react";
import TextConverterWidget from "@/components/tools/TextConverterWidget";
import { decodeBase64, encodeBase64 } from "@/lib/converters/base64";

export default function Base64Converter() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              mode === m ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      {mode === "encode" ? (
        <TextConverterWidget
          key="encode"
          inputLabel="Plain text"
          outputLabel="Base64"
          inputPlaceholder="Hello, world!"
          sample="Hello, world! 👋"
          outputFilename="encoded.txt"
          convert={encodeBase64}
        />
      ) : (
        <TextConverterWidget
          key="decode"
          inputLabel="Base64"
          outputLabel="Plain text"
          inputPlaceholder="SGVsbG8sIHdvcmxkIQ=="
          sample="SGVsbG8sIHdvcmxkISDwn5GL"
          outputFilename="decoded.txt"
          convert={decodeBase64}
        />
      )}
    </div>
  );
}
