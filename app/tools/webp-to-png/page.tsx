import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageConverter from "@/components/widgets/ImageConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("webp-to-png")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function WebpToPngPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Not every platform or piece of software accepts WebP files yet — some older content management systems, print workflows, and design tools still expect PNG. This free WebP to PNG converter switches your image back to the universally-supported PNG format while preserving full transparency, so you can use it anywhere PNG is expected. Drop a WebP file and the PNG version downloads automatically, with the conversion happening entirely in your browser."
      steps={[
        "Drop a WebP file into the box below, or click to browse.",
        "The PNG version is generated automatically.",
        "Download the converted PNG file.",
      ]}
      faq={[
        {
          question: "Why would I convert WebP to PNG?",
          answer: "Some older software, design tools, or platforms don't accept WebP uploads yet — converting to PNG maximizes compatibility.",
        },
        {
          question: "Is transparency preserved?",
          answer: "Yes, alpha transparency in your WebP image carries over to the PNG output.",
        },
        {
          question: "Will the file size increase after converting to PNG?",
          answer:
            "Usually yes, since PNG doesn't compress as efficiently as WebP — this is the expected tradeoff for maximum compatibility.",
        },
        {
          question: "Can I then compress the resulting PNG?",
          answer: "Yes — use our Compress PNG tool afterward if the resulting file is larger than you'd like.",
        },
        {
          question: "Is my image uploaded anywhere?",
          answer: "No, the conversion happens entirely in your browser using the Canvas API.",
        },
      ]}
    >
      <ImageConverter from="webp" to="png" />
    </ToolPageTemplate>
  );
}
