import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import UrlEncoderDecoder from "@/components/widgets/UrlEncoderDecoder";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("url-encoder-decoder")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function UrlEncoderDecoderPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="URLs can only safely contain a limited set of characters, so spaces, ampersands, question marks, and non-English letters have to be percent-encoded (a space becomes %20) to travel through a link without breaking it. This free URL encoder and decoder converts text in both directions. Choose Component mode to encode a single query value or path segment (encoding characters like & and ?), or Full URL mode to encode a whole address while leaving its structure intact. Everything runs in your browser, so even sensitive query strings stay on your device."
      steps={[
        "Paste your text or URL into the input box.",
        "Pick Component or Full URL mode.",
        "Click Encode or Decode, then copy the result.",
      ]}
      faq={[
        {
          question: "What's the difference between Component and Full URL mode?",
          answer:
            "Component mode (encodeURIComponent) encodes almost everything, including :, /, ?, and &, which is right for a single query value or path piece. Full URL mode (encodeURI) leaves those structural characters alone so a complete address stays valid.",
        },
        {
          question: "Why does my text turn into %20 and similar codes?",
          answer:
            "That's percent-encoding. Characters that aren't allowed in a URL are replaced with a % followed by their hex byte value — %20 is a space, for example.",
        },
        {
          question: "Why did decoding fail?",
          answer:
            "Decoding fails when the input isn't valid percent-encoding — for example a stray % that isn't followed by two hex digits. Check for malformed % sequences.",
        },
        {
          question: "When should I URL-encode text?",
          answer:
            "Any time you put user input or arbitrary text into a URL — a search query, a redirect parameter, a filename — encode it so special characters don't break the link or change its meaning.",
        },
        {
          question: "Is my input uploaded?",
          answer:
            "No — encoding and decoding happen entirely in your browser, so even sensitive query strings never leave your device.",
        },
      ]}
    >
      <UrlEncoderDecoder />
    </ToolPageTemplate>
  );
}
