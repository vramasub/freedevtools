import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import QrCodeGenerator from "@/components/widgets/QrCodeGenerator";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("qr-code-generator")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="This free QR code generator turns any URL, text, or message into a scannable QR code, right in your browser. Type or paste your content, adjust the size, margin, error correction level, and colors, then download the result as a PNG or a scalable SVG. Nothing is uploaded to a server — the QR code is generated entirely on your device using the same encoding logic as native QR libraries, so it works offline and keeps whatever you're encoding private."
      steps={[
        "Type or paste the URL or text you want to encode.",
        "Adjust size, margin, error correction, and colors if you want.",
        "Download the QR code as a PNG or SVG.",
      ]}
      faq={[
        {
          question: "Is my data sent to a server to generate the QR code?",
          answer:
            "No. The QR code is generated entirely in your browser using JavaScript — nothing you type is uploaded, logged, or stored anywhere.",
        },
        {
          question: "What's the difference between PNG and SVG downloads?",
          answer:
            "PNG is a fixed-resolution image, good for sharing or embedding as-is. SVG is a vector format that stays crisp at any size, which is better if you plan to print the QR code large or resize it later.",
        },
        {
          question: "What does the error correction level do?",
          answer:
            "It controls how much of the QR code can be damaged, dirty, or obscured (e.g. by a logo) and still scan correctly — from L (~7% recovery) up to H (~30% recovery). Higher levels make the code denser, so only raise it if you need the extra resilience.",
        },
        {
          question: "Will the QR code expire or stop working?",
          answer:
            "No — this generates a static QR code that directly encodes your text or URL. It never expires and doesn't depend on any tracking or redirect service.",
        },
        {
          question: "Can I use custom colors for a QR code that still scans?",
          answer:
            "Yes, as long as there's enough contrast between the foreground and background colors. Very light foreground colors or low-contrast pairs can make the code harder for some scanners to read.",
        },
      ]}
    >
      <QrCodeGenerator />
    </ToolPageTemplate>
  );
}
