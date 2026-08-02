import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import HashGenerator from "@/components/widgets/HashGenerator";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("hash-generator")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function HashGeneratorPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Hashing turns any text or file into a fixed-length string of characters, useful for verifying a file wasn't corrupted or tampered with during a download, generating cache keys, or checking that two pieces of data are identical without comparing them directly. This free hash generator computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously from either typed text or an uploaded file, using your browser's built-in Web Crypto API for the SHA family. It's a common way to verify a file checksum against a value published by a software vendor, or to generate a quick hash for a script — all without uploading your file anywhere."
      steps={[
        "Choose Hash text or Hash file.",
        "Type text, or drop a file — hashes are calculated automatically.",
        "Copy any of the four hash values.",
      ]}
      faq={[
        {
          question: "Is MD5 or SHA-1 safe to use?",
          answer:
            "Both are considered cryptographically broken for security purposes (like password storage) but remain fine for non-security uses like checksums or detecting accidental file changes. Prefer SHA-256 or SHA-512 for anything security-sensitive.",
        },
        {
          question: "How large a file can I hash?",
          answer:
            "Since hashing happens in your browser, the limit is your device's available memory rather than an upload cap — but very large files may take a few seconds to process.",
        },
        {
          question: "How do I verify a file checksum?",
          answer:
            "Hash the downloaded file with this tool and compare the resulting hash against the checksum published by the source you downloaded it from — if they match exactly, the file wasn't corrupted or altered.",
        },
        {
          question: "Which hash algorithm should I use?",
          answer:
            "SHA-256 is a solid general-purpose default for checksums today. MD5 and SHA-1 are still common for legacy compatibility and non-security checksums, but shouldn't be relied on for anything security-critical.",
        },
        {
          question: "Is my file uploaded to a server for hashing?",
          answer:
            "No — hashing happens entirely in your browser using the Web Crypto API (for SHA) and a local JavaScript implementation (for MD5). Your file is never transmitted anywhere.",
        },
      ]}
    >
      <HashGenerator />
    </ToolPageTemplate>
  );
}
