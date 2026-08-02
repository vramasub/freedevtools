import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import DocxToPdf from "@/components/widgets/DocxToPdf";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("word-to-pdf")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function WordToPdfPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Drop a .docx file to convert it to a PDF with real, searchable text — not a screenshot. Headings, bold/italic text, bullet and numbered lists, tables, and images all carry over."
      steps={[
        "Drop a .docx file into the box below, or click to browse.",
        "Click Convert to PDF.",
        "The converted file downloads automatically.",
      ]}
      faq={[
        {
          question: "Will the PDF look exactly like my Word document?",
          answer:
            "The content and structure carry over — headings, paragraphs, bold/italic text, lists, tables, and images — but the text is rebuilt using standard PDF fonts rather than copying your document's exact fonts, and things like custom headers/footers, multi-column layouts, and precise spacing aren't replicated pixel-for-pixel. For most everyday documents (reports, letters, notes) this produces a clean, readable, fully text-searchable PDF.",
        },
        {
          question: "Does this work with old .doc files?",
          answer:
            "No — only the modern .docx format (Word 2007 and later) is supported. If you have an older .doc file, open and re-save it as .docx in Word first.",
        },
        {
          question: "Is the PDF text selectable and searchable?",
          answer:
            "Yes — unlike tools that convert by taking a screenshot of your document, this generates real PDF text, so you can select, copy, and search it like any normal PDF.",
        },
        {
          question: "Is this free to use, and is there a file size limit?",
          answer:
            "Yes, completely free with no account required. Since conversion happens in your browser rather than on a server, the practical limit is your device's available memory rather than an artificial file size cap.",
        },
        {
          question: "Are images and tables from my Word document preserved?",
          answer:
            "Yes — embedded images and tables are carried over into the PDF, with tables rendered as bordered grids and images scaled to fit the page width.",
        },
        {
          question: "Is my document uploaded anywhere during conversion?",
          answer:
            "No — the entire conversion happens locally in your browser using JavaScript. Your .docx file is never sent to a server.",
        },
      ]}
    >
      <DocxToPdf />
    </ToolPageTemplate>
  );
}
