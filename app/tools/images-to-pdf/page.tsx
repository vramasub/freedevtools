import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ImagesToPdf from "@/components/widgets/ImagesToPdf";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("images-to-pdf")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function ImagesToPdfPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Turning a set of photos or scanned pages into a single PDF makes them much easier to share, print, or archive than a folder of loose image files. This free images-to-PDF converter combines one or more JPG or PNG images into a single PDF document, one image per page, in whatever order you choose — useful for assembling scanned documents, building a simple photo booklet, or preparing images for a print shop that only accepts PDF. Everything happens in your browser, so your images are never uploaded anywhere."
      steps={[
        "Drop one or more PNG or JPG images into the box below.",
        "Reorder them using the up/down arrows if needed.",
        "Click Create PDF to download the result.",
      ]}
      faq={[
        {
          question: "What page size is used?",
          answer: "Each PDF page is sized to exactly match its source image's dimensions, so nothing is cropped or padded.",
        },
        {
          question: "Can I mix PNG and JPG images in one PDF?",
          answer: "Yes, you can combine both formats in a single document.",
        },
        {
          question: "Can I reorder the images before creating the PDF?",
          answer:
            "Yes — use the up and down arrows next to each image to set the exact page order before generating the PDF.",
        },
        {
          question: "Will this reduce my image quality?",
          answer: "No — images are embedded into the PDF at their original resolution and quality, without any recompression.",
        },
        {
          question: "Is there a limit on how many images I can combine?",
          answer:
            "No artificial limit — since the PDF is built entirely in your browser, the practical limit is your device's available memory.",
        },
      ]}
    >
      <ImagesToPdf />
    </ToolPageTemplate>
  );
}
