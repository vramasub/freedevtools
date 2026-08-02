import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImageResizer from "@/components/widgets/ImageResizer";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("resize-image")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function ResizeImagePage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Resizing an image to exact pixel dimensions is a common step before uploading to a website, social media profile, or design tool that enforces specific size limits. This free image resizer works with PNG, JPG, or WebP files and lets you set an exact width and height, with an option to lock the aspect ratio so the image doesn't stretch or distort. Drop your file, adjust the dimensions, and download the resized result — all without uploading the original image anywhere. It's a quick way to shrink an oversized photo, prepare a thumbnail, or fit an image into a platform's required dimensions."
      steps={[
        "Drop an image into the box below, or click to browse.",
        "Enter a new width or height — the other dimension updates automatically if aspect ratio is locked.",
        "Click Resize, then download the result.",
      ]}
      faq={[
        {
          question: "Can I resize without keeping the original proportions?",
          answer: "Yes — uncheck \"Lock aspect ratio\" to set width and height independently, which will stretch or squash the image.",
        },
        {
          question: "Does resizing change the file format?",
          answer: "No, the output keeps the same format as your original file (PNG stays PNG, JPG stays JPG, and so on).",
        },
        {
          question: "Can I resize an image to a specific file size instead of dimensions?",
          answer:
            "This tool controls pixel dimensions, not target file size directly — for reducing file size specifically, try our Compress PNG or Compress JPG tools, which can be combined with resizing for maximum size reduction.",
        },
        {
          question: "Will resizing reduce image quality?",
          answer:
            "Reducing dimensions (making an image smaller) generally looks fine; enlarging an image beyond its original size can make it look soft or blurry since no new detail is created.",
        },
        {
          question: "Is the resized image uploaded anywhere?",
          answer:
            "No — resizing happens entirely in your browser using the Canvas API. Your image is never uploaded.",
        },
      ]}
    >
      <ImageResizer />
    </ToolPageTemplate>
  );
}
