import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LogAnalyzer from "@/components/widgets/LogAnalyzer";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("log-analyzer")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function LogAnalyzerPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Paste or upload a raw log file — plain-text stack traces or JSON Lines structured logs — and instantly search across every entry with keyword or regex highlighting and log-level filters. Because everything runs locally in your browser, sensitive log data never leaves your machine, unlike pasting logs into a random online tool or AI chatbot."
      steps={[
        "Paste your log dump, or upload a file — format (plain text or JSON Lines) is detected automatically.",
        "Narrow down by log level using the chips, and/or search for a keyword or regex pattern.",
        "Review highlighted matches, then copy or download the full filtered results.",
      ]}
      faq={[
        {
          question: "Is it safe to paste production logs here?",
          answer:
            "Yes — everything is processed entirely in your browser and never uploaded anywhere, so it's safe for logs containing customer data, internal service names, or infrastructure details that you wouldn't want to paste into a random website or AI chat tool.",
        },
        {
          question: "What log formats are supported?",
          answer:
            "Plain-text logs with multi-line stack traces (Java/Python/Node-style, including \"Caused by:\" chains) and JSON Lines structured logs (one JSON object per line) are both auto-detected, with a manual override if detection gets it wrong.",
        },
        {
          question: "Can it handle very large log dumps?",
          answer:
            "Yes — it's built for tens or hundreds of thousands of lines. Search is debounced so typing stays responsive, on-screen results are capped at 300 entries for performance, and you can always download the complete filtered result set regardless of the cap.",
        },
        {
          question: "Does it summarize error frequency or trends?",
          answer:
            "Not yet — this version focuses on fast keyword and regex search with level filtering. A frequency/summary view that groups recurring errors may be added in a future update.",
        },
        {
          question: "How is this different from a full log management platform?",
          answer:
            "Enterprise tools like Splunk or Datadog are built for continuously ingesting and monitoring live infrastructure logs. This tool is built for a much simpler, common task — pasting a log snippet or downloaded log file and quickly searching it for a keyword or error, with no setup, account, or infrastructure required.",
        },
        {
          question: "Can I search using a regular expression instead of plain text?",
          answer:
            "Yes — enable the \"Use regex\" option to search with a full JavaScript regular expression instead of a plain substring match.",
        },
      ]}
    >
      <LogAnalyzer />
    </ToolPageTemplate>
  );
}
