"use client";

import TextConverterWidget from "@/components/tools/TextConverterWidget";
import { jsonToYaml, yamlToJson } from "@/lib/converters/jsonYaml";

const SAMPLE_JSON = `{\n  "name": "web-app",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node index.js"\n  }\n}`;
const SAMPLE_YAML = `name: web-app\nversion: 1.0.0\nscripts:\n  start: node index.js`;

export default function JsonYamlConverter({ mode }: { mode: "json-to-yaml" | "yaml-to-json" }) {
  if (mode === "json-to-yaml") {
    return (
      <TextConverterWidget
        inputLabel="JSON input"
        outputLabel="YAML output"
        inputPlaceholder='{"name": "web-app"}'
        sample={SAMPLE_JSON}
        uploadAccept=".json,application/json"
        outputFilename="converted.yaml"
        outputMime="application/x-yaml"
        convert={jsonToYaml}
      />
    );
  }

  return (
    <TextConverterWidget
      inputLabel="YAML input"
      outputLabel="JSON output"
      inputPlaceholder="name: web-app"
      sample={SAMPLE_YAML}
      uploadAccept=".yaml,.yml,text/yaml"
      outputFilename="converted.json"
      outputMime="application/json"
      convert={yamlToJson}
    />
  );
}
