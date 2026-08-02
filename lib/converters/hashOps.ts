import SparkMD5 from "spark-md5";

export interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashBuffer(data: ArrayBuffer): Promise<HashResults> {
  const [sha1, sha256, sha512] = await Promise.all([
    crypto.subtle.digest("SHA-1", data),
    crypto.subtle.digest("SHA-256", data),
    crypto.subtle.digest("SHA-512", data),
  ]);

  return {
    md5: SparkMD5.ArrayBuffer.hash(data),
    sha1: bufferToHex(sha1),
    sha256: bufferToHex(sha256),
    sha512: bufferToHex(sha512),
  };
}

export async function hashText(text: string): Promise<HashResults> {
  const data = new TextEncoder().encode(text);
  return hashBuffer(data.buffer as ArrayBuffer);
}

export async function hashFile(file: File): Promise<HashResults> {
  const buffer = await file.arrayBuffer();
  return hashBuffer(buffer);
}
