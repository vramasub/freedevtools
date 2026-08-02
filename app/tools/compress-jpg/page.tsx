import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageCompressor from "@/components/widgets/ImageCompressor";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("compress-jpg")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function CompressJpgPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="JPG is already a lossy format, but most photos straight from a camera or phone are saved at a much higher quality than needed for the web — meaning there's usually plenty of room to shrink them further with barely any visible change. This free JPG compressor lets you re-encode a JPG at a lower quality setting, showing the resulting file size instantly so you can find the right balance between size and appearance. It's useful for speeding up a website, fitting under an email attachment limit, or saving storage space. Compression runs entirely in your browser, so your photos are never uploaded anywhere."
      steps={[
        "Drop a JPG file into the box below, or click to browse.",
        "Adjust the quality slider — lower quality means a smaller file.",
        "Download the compressed JPG.",
      ]}
      faq={[
        {
          question: "What quality setting should I use?",
          answer:
            "70-85% is a good balance for most photos — noticeably smaller than the original with little visible quality loss. Go lower for thumbnails or backgrounds where quality matters less.",
        },
        {
          question: "Is this lossy?",
          answer:
            "Yes — JPG compression at lower quality settings discards some image detail. Keep your original file if you might need full quality again later.",
        },
        {
          question: "How much smaller will my JPG get?",
          answer:
            "It depends on the original quality and image content, but reducing to 70-80% quality often cuts file size by 50% or more with minimal visible difference for typical photos.",
        },
        {
          question: "Is my photo uploaded to a server?",
          answer: "No — compression happens entirely in your browser. Your photo is never sent anywhere.",
        },
        {
          question: "Can I compress a PNG with this tool instead?",
          answer:
            "Use our dedicated Compress PNG tool for PNG files — it uses a different technique (color reduction) better suited to PNG's lossless format.",
        },
      ]}
    >
      <ImageCompressor format="jpeg" />
    </ToolPageTemplate>
  );
}
