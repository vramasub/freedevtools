import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import Base64Converter from "@/components/widgets/Base64Converter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("base64-encode-decode")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function Base64Page() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Base64 is a way of representing binary or text data using only printable ASCII characters, which makes it safe to embed in places that don't handle raw binary well — URLs, JSON payloads, HTML, email attachments, and data URIs for images. This free tool encodes plain text to Base64 or decodes Base64 back to readable text, correctly handling Unicode characters like emoji and accented letters rather than corrupting them. It's commonly used to decode a Base64-encoded JWT segment, inspect an API token, or prepare a string for embedding in a URL — all processed entirely in your browser."
      steps={[
        "Paste text into the input box.",
        "Click Convert.",
        "Copy the result or download it as a text file.",
      ]}
      faq={[
        {
          question: "Does this handle emoji and non-English text?",
          answer:
            "Yes — text is encoded as UTF-8 before Base64 conversion, so accented characters, emoji, and other Unicode text round-trip correctly.",
        },
        {
          question: "What is Base64 used for?",
          answer:
            "Base64 encodes binary or text data using only readable ASCII characters, commonly used for embedding data in URLs, JSON, HTML, or email attachments.",
        },
        {
          question: "Is Base64 encoding the same as encryption?",
          answer:
            "No — Base64 is not encryption and provides no security. It's purely a way to represent data in text form; anyone can decode it instantly, so never use it to protect sensitive information.",
        },
        {
          question: "Why does my decoded text show an error?",
          answer:
            "If the input isn't valid Base64, or decoding it doesn't produce valid UTF-8 text, you'll see a clear error message rather than garbled output.",
        },
        {
          question: "Is it safe to decode Base64 online?",
          answer:
            "With this tool, yes — decoding happens entirely in your browser and your input is never sent to a server, unlike some online decoders that process data server-side.",
        },
      ]}
    >
      <Base64Converter />
    </ToolPageTemplate>
  );
}
