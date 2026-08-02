"use client";

import TextConverterWidget from "@/components/tools/TextConverterWidget";
import { jsonToXml, xmlToJson } from "@/lib/converters/xmlJson";

const SAMPLE_XML = `<person>\n  <name>Ada Lovelace</name>\n  <role>Engineer</role>\n</person>`;
const SAMPLE_JSON = `{\n  "person": {\n    "name": "Ada Lovelace",\n    "role": "Engineer"\n  }\n}`;

export default function XmlJsonConverter({ mode }: { mode: "xml-to-json" | "json-to-xml" }) {
  if (mode === "xml-to-json") {
    return (
      <TextConverterWidget
        inputLabel="XML input"
        outputLabel="JSON output"
        inputPlaceholder="<person><name>Ada</name></person>"
        sample={SAMPLE_XML}
        uploadAccept=".xml,text/xml,application/xml"
        outputFilename="converted.json"
        outputMime="application/json"
        convert={xmlToJson}
      />
    );
  }

  return (
    <TextConverterWidget
      inputLabel="JSON input"
      outputLabel="XML output"
      inputPlaceholder='{"person": {"name": "Ada"}}'
      sample={SAMPLE_JSON}
      uploadAccept=".json,application/json"
      outputFilename="converted.xml"
      outputMime="application/xml"
      convert={jsonToXml}
    />
  );
}
