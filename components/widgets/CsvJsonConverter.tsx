"use client";

import TextConverterWidget from "@/components/tools/TextConverterWidget";
import { csvToJson, jsonToCsv } from "@/lib/converters/csvJson";

const SAMPLE_CSV = `name,role,years\nAda Lovelace,Engineer,5\nGrace Hopper,Engineer,8`;
const SAMPLE_JSON = `[\n  { "name": "Ada Lovelace", "role": "Engineer", "years": 5 },\n  { "name": "Grace Hopper", "role": "Engineer", "years": 8 }\n]`;

export default function CsvJsonConverter({ mode }: { mode: "csv-to-json" | "json-to-csv" }) {
  if (mode === "csv-to-json") {
    return (
      <TextConverterWidget
        inputLabel="CSV input"
        outputLabel="JSON output"
        inputPlaceholder="name,role,years&#10;Ada Lovelace,Engineer,5"
        sample={SAMPLE_CSV}
        uploadAccept=".csv,text/csv"
        outputFilename="converted.json"
        outputMime="application/json"
        convert={csvToJson}
      />
    );
  }

  return (
    <TextConverterWidget
      inputLabel="JSON input"
      outputLabel="CSV output"
      inputPlaceholder='[{"name":"Ada Lovelace","role":"Engineer"}]'
      sample={SAMPLE_JSON}
      uploadAccept=".json,application/json"
      outputFilename="converted.csv"
      outputMime="text/csv"
      convert={jsonToCsv}
    />
  );
}
