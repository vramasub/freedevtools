import { dump, load } from "js-yaml";

export function jsonToYaml(jsonText: string): string {
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

  return dump(data, { indent: 2, lineWidth: -1, noRefs: true });
}

export function yamlToJson(yamlText: string): string {
  const trimmed = yamlText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some YAML first.");
  }

  let data: unknown;
  try {
    data = load(trimmed);
  } catch (err) {
    throw new Error(`Invalid YAML: ${(err as Error).message}`);
  }

  return JSON.stringify(data, null, 2);
}
