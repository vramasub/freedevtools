import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CsvJsonConverter from "@/components/widgets/CsvJsonConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("csv-to-json")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function CsvToJsonPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Converting CSV to JSON is a common step when moving spreadsheet data into a web app, API, or NoSQL database — most JSON-based systems can't read comma-separated values directly. This free CSV to JSON converter handles that conversion entirely in your browser: paste CSV data or upload a .csv file, and get clean, formatted JSON back instantly. The first row is used as column headers and becomes the key names in each JSON object, and values that look like numbers or booleans are automatically converted to their proper JSON types rather than staying as quoted strings. Because nothing is uploaded to a server, it's safe to use with spreadsheets containing customer records, financial data, or anything else you wouldn't want to send to a third party."
      steps={[
        "Paste your CSV text into the left box, or click \"Upload file\" to load a .csv file.",
        "Click Convert.",
        "Copy the JSON output or download it as a .json file.",
      ]}
      faq={[
        {
          question: "Does the first row have to be a header row?",
          answer:
            "Yes — this tool treats the first row as column headers and uses them as the keys in each JSON object.",
        },
        {
          question: "Are numbers and booleans converted automatically?",
          answer:
            "Yes, values that look like numbers are converted to JSON numbers rather than staying as strings, using automatic type detection.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "Since conversion happens in your browser rather than on a server, the practical limit is your device's memory, not an artificial upload cap.",
        },
        {
          question: "How do I convert CSV to JSON without uploading my file?",
          answer:
            "This tool processes your CSV entirely in your browser using JavaScript — your file is parsed on your own device and never transmitted anywhere, so there's no upload step at all.",
        },
        {
          question: "Can I convert JSON back to CSV?",
          answer: "Yes — use our JSON to CSV converter to go the other direction.",
        },
        {
          question: "What happens to empty cells or missing values?",
          answer:
            "Empty CSV cells become empty strings in the resulting JSON. If a row has fewer columns than the header row, the missing keys are simply omitted from that row's object.",
        },
      ]}
    >
      <CsvJsonConverter mode="csv-to-json" />
    </ToolPageTemplate>
  );
}
