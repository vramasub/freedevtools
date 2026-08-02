import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PdfToDocx from "@/components/widgets/PdfToDocx";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("pdf-to-word")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function PdfToWordPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Drop a PDF to convert it into an editable .docx Word document. Text, paragraphs, headings, tables, and images are reconstructed automatically from the PDF's content."
      steps={[
        "Drop a PDF file into the box below, or click to browse.",
        "Click Convert to Word.",
        "The converted .docx file downloads automatically.",
      ]}
      faq={[
        {
          question: "Will the Word document look exactly like my PDF?",
          answer:
            "Not exactly — PDFs don't contain real paragraph or table structure the way Word documents do, so this tool reconstructs that structure heuristically from the position of text on the page. It works well for typical documents (reports, letters, simple tables) but won't match dedicated commercial converters on complex layouts, multi-column pages, or unusual formatting.",
        },
        {
          question: "What if my PDF is a scanned image?",
          answer:
            "This tool needs a real text layer to work. Scanned PDFs with no selectable text can't be converted — you'll see a clear error message rather than an empty or broken file.",
        },
        {
          question: "Are tables and images preserved?",
          answer:
            "The tool attempts to detect table-like content based on column alignment and rebuilds it as an actual Word table, and extracts embedded images where possible. Both are best-effort — irregular tables may come through as plain paragraph text instead.",
        },
        {
          question: "Is this free, and is there a file size limit?",
          answer:
            "Yes, completely free with no signup. Since conversion runs in your browser, the practical limit is your device's available memory rather than a server-imposed cap.",
        },
        {
          question: "Can I edit the resulting Word document?",
          answer:
            "Yes — the output is a standard .docx file with real paragraphs, headings, and tables that you can edit directly in Microsoft Word, Google Docs, or LibreOffice.",
        },
        {
          question: "Is my PDF uploaded to a server during conversion?",
          answer:
            "No — text extraction and document reconstruction happen entirely in your browser. Your PDF is never uploaded anywhere.",
        },
      ]}
    >
      <PdfToDocx />
    </ToolPageTemplate>
  );
}
