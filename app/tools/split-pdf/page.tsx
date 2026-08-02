import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PdfSplitter from "@/components/widgets/PdfSplitter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("split-pdf")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function SplitPdfPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Sometimes you only need a handful of pages from a larger PDF — an invoice from a bundled statement, a single chapter from a report, or specific pages to share separately. This free PDF splitter breaks a multi-page PDF into individual single-page files, delivered together as a zip you can download and unzip locally. It runs entirely in your browser, so there's no risk of your document being uploaded or stored anywhere else."
      steps={[
        "Drop a PDF file into the box below.",
        "Click Split & Download Zip.",
        "Unzip the file to get one PDF per page.",
      ]}
      faq={[
        {
          question: "Can I extract just a few specific pages instead of every page?",
          answer:
            "This tool currently splits every page into its own file — extract the ones you need from the resulting zip. Support for extracting a custom page range may be added later.",
        },
        {
          question: "What if my PDF only has one page?",
          answer: "There's nothing to split — a one-page PDF is already a single file.",
        },
        {
          question: "Do I need any software to unzip the result?",
          answer:
            "No — every major operating system (Windows, macOS, Linux) can open .zip files natively without installing anything extra.",
        },
        {
          question: "Is there a page limit?",
          answer:
            "No artificial limit — since splitting happens in your browser, the practical limit is your device's available memory rather than a server-imposed cap.",
        },
      ]}
    >
      <PdfSplitter />
    </ToolPageTemplate>
  );
}
