export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decodeBase64(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Paste some Base64 text first.");
  }

  let binary: string;
  try {
    binary = atob(trimmed.replace(/\s+/g, ""));
  } catch {
    throw new Error("That doesn't look like valid Base64.");
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Decoded bytes are not valid UTF-8 text.");
  }
}
