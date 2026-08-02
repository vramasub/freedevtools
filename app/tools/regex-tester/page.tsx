import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import RegexTester from "@/components/widgets/RegexTester";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("regex-tester")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function RegexTesterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Regular expressions are powerful but notoriously easy to get subtly wrong — a pattern that matches your first test case might fail on an edge case you didn't think of. This free regex tester lets you try a pattern against sample text and see every match highlighted live as you type, along with a running match count and any captured groups, so you can iterate quickly instead of testing blindly in your actual code. It uses standard JavaScript regular expression syntax — the same engine that powers browsers and Node.js — making it a natural fit for testing patterns you'll use in JavaScript or TypeScript."
      steps={[
        "Type a pattern (without the surrounding slashes).",
        "Toggle flags like global or ignore case as needed.",
        "Paste text to test against — matches highlight automatically.",
      ]}
      faq={[
        {
          question: "What regex flavor does this use?",
          answer:
            "Standard JavaScript regular expression syntax (the same engine used by browsers and Node.js) — slightly different in places from PCRE or Python's re module.",
        },
        {
          question: "Why do I only see one match?",
          answer:
            "Enable the Global (g) flag to find every match in the text instead of stopping at the first one.",
        },
        {
          question: "Can I test regex for languages other than JavaScript?",
          answer:
            "This tool uses JavaScript's regex engine specifically, which is similar to but not identical to PCRE (PHP) or Python's re module — most common patterns behave the same, but some advanced features differ.",
        },
        {
          question: "How do I capture and view groups in my match?",
          answer:
            "Add parentheses around the part of your pattern you want to capture, e.g. (\\d+) — matched groups appear listed below each match in the results.",
        },
        {
          question: "Is my test text uploaded anywhere?",
          answer:
            "No — all matching happens locally in your browser using JavaScript's built-in RegExp engine. Nothing you type is sent to a server.",
        },
      ]}
    >
      <RegexTester />
    </ToolPageTemplate>
  );
}
