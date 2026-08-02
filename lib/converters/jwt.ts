export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    segment.length + ((4 - (segment.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new Error("Paste a JWT first.");
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT should have three dot-separated parts (header.payload.signature).");
  }

  const [headerPart, payloadPart, signature] = parts;

  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(base64UrlDecode(headerPart));
  } catch {
    throw new Error("Could not decode the token header — it may not be a valid JWT.");
  }
  try {
    payload = JSON.parse(base64UrlDecode(payloadPart));
  } catch {
    throw new Error("Could not decode the token payload — it may not be a valid JWT.");
  }

  return { header, payload, signature };
}
