function describePosition(text: string, message: string): string {
  const match = message.match(/position (\d+)/i);
  if (!match) return message;
  const pos = Number(match[1]);
  const upToPos = text.slice(0, pos);
  const line = upToPos.split("\n").length;
  const column = pos - upToPos.lastIndexOf("\n");
  return `${message} (line ${line}, column ${column})`;
}

export function formatJson(jsonText: string, indent = 2): string {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some JSON first.");
  }

  try {
    const data = JSON.parse(trimmed);
    return JSON.stringify(data, null, indent);
  } catch (err) {
    throw new Error(describePosition(trimmed, (err as Error).message));
  }
}

export function minifyJson(jsonText: string): string {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    throw new Error("Paste or upload some JSON first.");
  }

  try {
    const data = JSON.parse(trimmed);
    return JSON.stringify(data);
  } catch (err) {
    throw new Error(describePosition(trimmed, (err as Error).message));
  }
}
