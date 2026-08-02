import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageConverter from "@/components/widgets/ImageConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("png-to-webp")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function PngToWebpPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="WebP is a modern image format developed by Google that typically produces files 25-50% smaller than PNG at the same visual quality, while still supporting full alpha transparency — making it a strong choice for website images where load time matters. This free PNG to WebP converter re-encodes your PNG file in your browser, so you can shrink images for a faster website without uploading anything or installing image editing software. Just drop a PNG, adjust the quality if needed, and download the converted WebP file."
      steps={[
        "Drop a PNG file into the box below, or click to browse.",
        "Adjust the quality slider if needed.",
        "Download the converted WebP file.",
      ]}
      faq={[
        {
          question: "Does WebP support transparency like PNG?",
          answer: "Yes, WebP fully supports alpha transparency, so transparent areas in your PNG are preserved.",
        },
        {
          question: "Will every browser display WebP images?",
          answer: "Yes, all modern browsers (Chrome, Firefox, Safari, Edge) support WebP for display.",
        },
        {
          question: "How much smaller will the WebP file be?",
          answer:
            "Typically 25-50% smaller than the original PNG at similar visual quality, though the exact reduction depends on the image content — flat-color graphics tend to shrink the most.",
        },
        {
          question: "Can I convert WebP back to PNG?",
          answer: "Yes — use our WebP to PNG converter to reverse the conversion.",
        },
        {
          question: "Is my PNG uploaded to a server?",
          answer:
            "No — the conversion happens entirely in your browser using the Canvas API. Your image is never uploaded.",
        },
      ]}
    >
      <ImageConverter from="png" to="webp" />
    </ToolPageTemplate>
  );
}
