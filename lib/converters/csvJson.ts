import Papa from "papaparse";

export function csvToJson(csvText: string): string {
  const trimmed = csvText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some CSV first.");
  }

  const result = Papa.parse<Record<string, string>>(trimmed, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    const first = result.errors[0];
    throw new Error(`Row ${first.row ?? "?"}: ${first.message}`);
  }

  return JSON.stringify(result.data, null, 2);
}

export function jsonToCsv(jsonText: string): string {
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

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    throw new Error("JSON array is empty — nothing to convert.");
  }

  return Papa.unparse(rows as Record<string, unknown>[]);
}
