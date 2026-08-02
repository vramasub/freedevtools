import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageConverter from "@/components/widgets/ImageConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("jpg-to-webp")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JpgToWebpPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="WebP typically shrinks JPG photos by 25-35% at equivalent visual quality, making it a popular choice for speeding up websites without a noticeable drop in image quality. This free JPG to WebP converter runs the conversion entirely in your browser — drop a JPG or JPEG file, adjust the quality slider if needed, and download a smaller WebP version ready to use on your site or app. No installation, no uploading your photos to a server."
      steps={[
        "Drop a JPG file into the box below, or click to browse.",
        "Adjust the quality slider if needed.",
        "Download the converted WebP file.",
      ]}
      faq={[
        {
          question: "How much smaller will the file be?",
          answer: "WebP typically produces files 25-35% smaller than an equivalent-quality JPG, though results vary by image content.",
        },
        {
          question: "Can I convert back to JPG later?",
          answer: "Yes — use our WebP to PNG tool for lossless formats, or re-convert with an image editor if you specifically need JPG again.",
        },
        {
          question: "Is WebP better than JPG for websites?",
          answer:
            "For most use cases, yes — WebP produces smaller files at similar visual quality, which helps page load speed and Core Web Vitals scores.",
        },
        {
          question: "Does this work with photos straight from my phone?",
          answer: "Yes, you can drop any standard JPG/JPEG file, including photos exported directly from a phone camera.",
        },
        {
          question: "Is my photo uploaded anywhere?",
          answer: "No — conversion happens entirely in your browser. Your photo never leaves your device.",
        },
      ]}
    >
      <ImageConverter from="jpeg" to="webp" />
    </ToolPageTemplate>
  );
}
