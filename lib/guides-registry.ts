export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  relatedTools: string[];
}

export const guides: GuideMeta[] = [
  {
    slug: "csv-vs-json",
    title: "CSV vs JSON: When to Use Each",
    description:
      "CSV and JSON solve different problems. A practical guide to when each format actually fits, and what breaks when you pick the wrong one.",
    publishedAt: "2026-08-26",
    relatedTools: ["csv-to-json", "json-to-csv"],
  },
  {
    slug: "png-vs-jpg-vs-webp",
    title: "PNG vs JPG vs WebP: Choosing the Right Image Format",
    description:
      "Lossless vs lossy, transparency, and file size — a practical guide to picking the right image format instead of defaulting to whatever you always use.",
    publishedAt: "2026-08-26",
    relatedTools: ["compress-png", "compress-jpg", "png-to-webp", "image-converter"],
  },
  {
    slug: "pdf-vs-docx",
    title: "PDF vs DOCX: Which Should You Send?",
    description:
      "PDF and DOCX aren't interchangeable — one is for reading, one is for editing. A practical guide to picking the right one before you hit send.",
    publishedAt: "2026-08-26",
    relatedTools: ["word-to-pdf", "pdf-to-word"],
  },
  {
    slug: "what-is-base64-encoding",
    title: "What Is Base64 Encoding, Really?",
    description:
      "Base64 isn't encryption and it isn't compression — it's a way to make binary data safe to put where only text belongs. Here's what it actually does.",
    publishedAt: "2026-08-26",
    relatedTools: ["base64-encode-decode"],
  },
  {
    slug: "uuid-v4-vs-v1-vs-v5",
    title: "UUID v4 vs v1 vs v5: What's the Difference?",
    description:
      "Not all UUIDs are random. A practical guide to the three UUID versions you'll actually encounter, and which one your system should be generating.",
    publishedAt: "2026-08-26",
    relatedTools: ["uuid-generator"],
  },
  {
    slug: "md5-vs-sha256",
    title: "MD5 vs SHA-256: Which Hash Should You Use?",
    description:
      "MD5 is fast and broken for security purposes; SHA-256 is neither. A practical guide to picking the right hash function for the job you actually have.",
    publishedAt: "2026-08-26",
    relatedTools: ["hash-generator"],
  },
  {
    slug: "why-client-side-processing-is-more-private",
    title: "Why Client-Side File Processing Is Actually More Private",
    description:
      "\"We don't store your files\" still means your file was on someone else's server. Here's what actually changes when a tool never uploads anything at all.",
    publishedAt: "2026-08-26",
    relatedTools: ["csv-to-json", "compress-png", "hash-generator"],
  },
  {
    slug: "what-is-a-jwt",
    title: "What Is a JWT (JSON Web Token), Really?",
    description:
      "A JWT looks encrypted and isn't — it's a signed, readable claim anyone can decode. Here's what's actually inside one, and what the signature does and doesn't protect.",
    publishedAt: "2026-09-26",
    relatedTools: ["jwt-decoder"],
  },
  {
    slug: "yaml-vs-json",
    title: "YAML vs JSON: Which Should You Use?",
    description:
      "YAML and JSON encode the same data model but read completely differently. A practical guide to when YAML's readability is worth it, and when JSON's simplicity wins.",
    publishedAt: "2026-09-26",
    relatedTools: ["yaml-to-json", "json-to-yaml"],
  },
  {
    slug: "what-is-unix-timestamp",
    title: "What Is a Unix Timestamp (and Why Does It Start in 1970)?",
    description:
      "A Unix timestamp is just a count of seconds — no timezone, no calendar, no ambiguity. Here's why systems store time this way and how to read one.",
    publishedAt: "2026-09-26",
    relatedTools: ["unix-timestamp-converter"],
  },
  {
    slug: "how-qr-codes-work",
    title: "How Do QR Codes Actually Work?",
    description:
      "A QR code isn't a picture of your data — it's structured, error-corrected binary. Here's what's actually encoded in those black and white squares.",
    publishedAt: "2026-09-26",
    relatedTools: ["qr-code-generator"],
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return guides.find((guide) => guide.slug === slug);
}
