import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CsvJsonConverter from "@/components/widgets/CsvJsonConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-to-csv")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JsonToCsvPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="JSON is the default format for most APIs, but spreadsheets, reporting tools, and non-technical teammates usually expect CSV. This free JSON to CSV converter takes a JSON array of objects — the most common shape for API responses and exported data — and turns it into a CSV file you can open directly in Excel, Google Sheets, or any spreadsheet tool. Object keys become column headers automatically, so as long as your JSON objects share a consistent set of fields, the output lines up into a clean table. Like every tool on this site, the conversion runs entirely in your browser, so you can convert JSON containing sensitive records without it ever leaving your device."
      steps={[
        "Paste a JSON array of objects into the left box, or upload a .json file.",
        "Click Convert.",
        "Copy the CSV output or download it as a .csv file.",
      ]}
      faq={[
        {
          question: "What JSON shape does this expect?",
          answer:
            'An array of flat objects works best, e.g. [{"name":"Ada"},{"name":"Grace"}]. A single object is also accepted and converted to a one-row CSV.',
        },
        {
          question: "What happens with nested objects or arrays?",
          answer:
            "Nested values are stringified into the cell rather than expanded into extra columns. For deeply nested data, flatten it first.",
        },
        {
          question: "Can I open the CSV output directly in Excel?",
          answer:
            "Yes — download the file and open it in Excel, Google Sheets, or Numbers; it uses standard comma-separated formatting with quoted fields where needed.",
        },
        {
          question: "Does this work with a single JSON object instead of an array?",
          answer:
            "Yes, a single object is treated as one row and converted to a one-line CSV with a header row.",
        },
        {
          question: "Is my JSON data uploaded anywhere?",
          answer:
            "No — the conversion happens entirely in your browser using JavaScript. Your JSON never leaves your device.",
        },
      ]}
    >
      <CsvJsonConverter mode="json-to-csv" />
    </ToolPageTemplate>
  );
}
