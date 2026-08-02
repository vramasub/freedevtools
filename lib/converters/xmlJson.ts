import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  indentBy: "  ",
});

export function xmlToJson(xmlText: string): string {
  const trimmed = xmlText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some XML first.");
  }

  let data: unknown;
  try {
    data = parser.parse(trimmed);
  } catch (err) {
    throw new Error(`Invalid XML: ${(err as Error).message}`);
  }

  return JSON.stringify(data, null, 2);
}

export function jsonToXml(jsonText: string): string {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some JSON first.");
  }

  let data: unknown;
  try {
    data = JSON.parse(trimmed);
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`);
  }

  try {
    return builder.build(data);
  } catch (err) {
    throw new Error(`Could not build XML: ${(err as Error).message}`);
  }
}
