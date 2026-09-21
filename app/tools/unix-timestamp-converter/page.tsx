import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import UnixTimestampConverter from "@/components/widgets/UnixTimestampConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("unix-timestamp-converter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function UnixTimestampConverterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="A Unix timestamp — the number of seconds since January 1, 1970 UTC — is how computers and APIs represent a moment in time, but it's unreadable at a glance. This free converter goes both ways: paste a timestamp to see the human-readable date in your local time, UTC, and ISO 8601, or pick a date and time to get its epoch value in seconds and milliseconds. It also shows the current Unix time, ticking live. It auto-detects whether your input is in seconds or milliseconds, and runs entirely in your browser."
      steps={[
        "To read a timestamp, paste it into the 'Timestamp to date' box.",
        "To get a timestamp, pick a date and time in the 'Date to timestamp' box.",
        "Copy the value in the format you need.",
      ]}
      faq={[
        {
          question: "What is a Unix timestamp?",
          answer:
            "It's the number of seconds that have elapsed since the Unix epoch, 00:00:00 UTC on 1 January 1970. It's a compact, timezone-independent way for software to store and exchange points in time.",
        },
        {
          question: "Does it use seconds or milliseconds?",
          answer:
            "Both. When reading a timestamp, the tool auto-detects the unit — 13 or more digits is treated as milliseconds, fewer as seconds. When generating one, it gives you both.",
        },
        {
          question: "What timezone are the results in?",
          answer:
            "The 'Local' result uses your device's timezone; 'UTC' and 'ISO 8601' are in Coordinated Universal Time so they're unambiguous across regions.",
        },
        {
          question: "Why does the current timestamp keep changing?",
          answer:
            "It updates every second to show the live Unix time, which genuinely increases by one each second.",
        },
        {
          question: "Is my data sent to a server?",
          answer:
            "No — all conversion happens locally in your browser using JavaScript's Date object.",
        },
      ]}
    >
      <UnixTimestampConverter />
    </ToolPageTemplate>
  );
}
