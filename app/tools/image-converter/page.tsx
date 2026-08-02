import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageConverter from "@/components/widgets/ImageConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-converter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function ImageConverterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Sometimes you need to convert between PNG, JPG, and WebP but don't know exactly which pair you'll need next — this general-purpose image converter handles any direction between all three formats in one place. Drop an image, pick your target format from the dropdown, adjust quality if the format supports it, and download the result. It's a flexible alternative to using separate single-purpose converters, and like every tool on this site, the conversion happens entirely in your browser without uploading your image anywhere."
      steps={[
        "Drop an image into the box below, or click to browse.",
        "Choose your target format from the dropdown.",
        "Download the converted file.",
      ]}
      faq={[
        {
          question: "Which format should I choose?",
          answer:
            "WebP for the smallest file size with good quality, PNG for lossless quality and transparency, or JPG for maximum compatibility with older tools.",
        },
        {
          question: "Are there dedicated pages for common conversions?",
          answer:
            "Yes — see PNG to WebP, JPG to WebP, and WebP to PNG for a more focused experience with the same underlying tool.",
        },
        {
          question: "Which format should I use for transparency?",
          answer:
            "PNG and WebP both support transparency; JPG does not, so avoid converting a transparent image to JPG unless you're okay with transparent areas becoming solid white or black.",
        },
        {
          question: "Can I batch convert multiple images at once?",
          answer:
            "This tool converts one image at a time. For multiple files, repeat the process for each — since everything runs locally, there's no upload wait between conversions.",
        },
        {
          question: "Is my image ever uploaded to a server?",
          answer:
            "No — every conversion happens entirely in your browser using the Canvas API. Your image file is never transmitted anywhere.",
        },
      ]}
    >
      <ImageConverter />
    </ToolPageTemplate>
  );
}
