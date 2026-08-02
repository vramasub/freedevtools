import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import JsonFormatter from "@/components/widgets/JsonFormatter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-formatter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JsonFormatterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Whether you're debugging an API response, cleaning up a config file, or just trying to read minified JSON someone pasted into a chat, a reliable JSON formatter saves real time. This free tool validates your JSON and either pretty-prints it with proper indentation or minifies it down to a single compact line, and if your JSON is invalid, it tells you where the syntax error is instead of just failing silently. It works entirely client-side, so you can format and validate JSON containing API keys or internal data structures without it touching a server."
      steps={[
        "Paste your JSON into the left box, or upload a .json file.",
        "Click Format to pretty-print with 2-space indentation, or Minify to compress it onto one line.",
        "Copy the result or download it as a .json file.",
      ]}
      faq={[
        {
          question: "What happens if my JSON is invalid?",
          answer:
            "An error message appears below the boxes describing the problem, including the line and column where parsing failed where possible.",
        },
        {
          question: "Does formatting change the data?",
          answer:
            "No — formatting only changes whitespace and indentation. The underlying keys, values, and structure are unchanged.",
        },
        {
          question: "What's the difference between formatting and minifying?",
          answer:
            "Formatting adds indentation and line breaks to make JSON human-readable; minifying strips all unnecessary whitespace to make the file as small as possible for production use.",
        },
        {
          question: "Can this validate JSON without formatting it?",
          answer:
            "Yes — if your JSON has a syntax error, you'll see the error message immediately when you click Format or Minify, describing exactly what's wrong.",
        },
        {
          question: "Is this a safe way to format JSON containing API keys or secrets?",
          answer:
            "Yes — formatting happens entirely in your browser, so the JSON you paste is never sent to a server, unlike many online JSON formatters that process input server-side.",
        },
      ]}
    >
      <JsonFormatter />
    </ToolPageTemplate>
  );
}
