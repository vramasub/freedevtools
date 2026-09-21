import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import WordCounter from "@/components/widgets/WordCounter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("word-counter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function WordCounterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Whether you're staying under a 280-character post limit, hitting a minimum word count for an essay, or trimming a meta description to fit Google's ~155-character cutoff, knowing the exact size of your text matters. This free word and character counter tallies your words, characters (with and without spaces), sentences, and paragraphs live as you type, and estimates reading time based on an average pace of around 200 words per minute. Everything runs entirely in your browser — your text is never uploaded or stored anywhere — so it's safe to paste in a draft, a client email, or anything else you'd rather not send to a random server."
      steps={[
        "Type directly into the box, or paste text you've already written.",
        "Watch the counts update instantly as you edit.",
        "Use the reading-time estimate to gauge how long your text takes to read.",
      ]}
      faq={[
        {
          question: "How is a word counted?",
          answer:
            "A word is any run of characters separated by spaces or line breaks. This matches how most word processors and social platforms count, though tools can differ slightly on edge cases like hyphenated terms.",
        },
        {
          question: "What's the difference between characters with and without spaces?",
          answer:
            "Characters with spaces counts every character you type, including spaces and line breaks. Characters without spaces excludes all whitespace — useful when a limit specifically counts visible characters.",
        },
        {
          question: "How is reading time estimated?",
          answer:
            "It divides your word count by 200, a common estimate for average adult silent reading speed. Actual speed varies by reader and material, so treat it as a rough guide.",
        },
        {
          question: "Is my text sent anywhere?",
          answer:
            "No. All counting happens locally in your browser using JavaScript. Nothing you type is uploaded, logged, or stored, so it's safe for private or sensitive drafts.",
        },
        {
          question: "Can I use this for post or meta description limits?",
          answer:
            "Yes — the live character count is ideal for staying under limits like a 280-character social post or a search engine meta description's roughly 155-character cutoff.",
        },
      ]}
    >
      <WordCounter />
    </ToolPageTemplate>
  );
}
