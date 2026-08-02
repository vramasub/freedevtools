import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageCompressor from "@/components/widgets/ImageCompressor";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("compress-png")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function CompressPngPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Large PNG files slow down websites, bloat email attachments, and eat into storage quotas — but PNG's lossless compression means simply re-saving a file rarely helps. This free online PNG compressor shrinks file size by reducing the number of distinct colors in the image (color quantization, similar to what tools like TinyPNG use), while staying in the PNG format the whole time. Drop a file and use the quality slider to compress PNG without losing quality that actually matters — screenshots, icons, and illustrations often shrink dramatically with no visible difference. Everything happens in your browser, so your images are never uploaded to a server."
      steps={[
        "Drop a PNG file into the box below, or click to browse.",
        "Adjust the quality slider — lower quality means a smaller file with fewer colors.",
        "Download the compressed PNG.",
      ]}
      faq={[
        {
          question: "Will this reduce image quality?",
          answer:
            "Yes, at lower quality settings — this works by reducing the number of distinct colors in the image (color quantization), which can shrink file size significantly for illustrations, icons, and screenshots with minimal visible difference. Photos with smooth gradients will show more visible change at low settings.",
        },
        {
          question: "How do I keep the best quality while still saving space?",
          answer:
            "Start near 100% and lower the slider gradually while watching the reported file size — many images look identical down to 50-70% quality.",
        },
        {
          question: "I need a much smaller file — what should I do?",
          answer:
            "For larger reductions, consider converting to WebP (usually 25-50% smaller than PNG) using our PNG to WebP tool, or resizing the image first if it's larger than you need.",
        },
        {
          question: "Does this work well for screenshots and icons?",
          answer:
            "Yes — flat-color images like screenshots, UI mockups, and icons typically compress the best, often shrinking 60-80% with no visible quality loss.",
        },
        {
          question: "Is my image uploaded to a server?",
          answer:
            "No — compression happens entirely in your browser using JavaScript. Your image file never leaves your device.",
        },
      ]}
    >
      <ImageCompressor format="png" />
    </ToolPageTemplate>
  );
}
