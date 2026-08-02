import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PdfMerger from "@/components/widgets/PdfMerger";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("merge-pdf")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function MergePdfPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Combining multiple PDF files into one document is a common task — assembling a report from separate sections, merging scanned pages, or putting together a portfolio. This free PDF merger lets you combine two or more PDF files into a single document, in whatever order you choose, without adding a watermark or requiring an account. Drop your files, reorder them if needed, and download the merged result. Because merging happens entirely in your browser, your documents are never uploaded to a server — a meaningful difference if your PDFs contain contracts, personal records, or other sensitive content."
      steps={[
        "Drop two or more PDF files into the box below.",
        "Reorder them using the up/down arrows if needed.",
        "Click Merge & Download to get the combined PDF.",
      ]}
      faq={[
        {
          question: "Is there a limit on how many files I can merge?",
          answer: "No artificial limit — since merging happens in your browser, the only limit is your device's available memory.",
        },
        {
          question: "Will this work with password-protected PDFs?",
          answer: "No — encrypted PDFs can't be read without the password. Remove password protection first using your PDF viewer, then merge.",
        },
        {
          question: "Does this add a watermark to the merged PDF?",
          answer:
            "No — the output is a clean, unmodified merged PDF with no watermark, branding, or promotional page added.",
        },
        {
          question: "Can I reorder the files before merging?",
          answer:
            "Yes — use the up and down arrows next to each file to arrange them in the exact order you want before merging.",
        },
        {
          question: "Is this free to use?",
          answer:
            "Yes, completely free with no page limits, file count limits, or daily usage caps — since there's no server-side processing, there's no cost to restrict.",
        },
      ]}
    >
      <PdfMerger />
    </ToolPageTemplate>
  );
}
