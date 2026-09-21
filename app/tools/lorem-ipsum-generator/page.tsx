import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import LoremIpsum from "@/components/widgets/LoremIpsum";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("lorem-ipsum-generator")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function LoremIpsumPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Placeholder text lets you design and build layouts before the real copy is ready, so a mockup shows realistic text flow instead of empty boxes. This free Lorem Ipsum generator produces classic dummy text by the paragraph, sentence, or word, and can start with the traditional 'Lorem ipsum dolor sit amet…' opening or jump straight into randomized filler. Pick how much you need, generate, and copy or download it in one click. It all runs in your browser — no popups, no account, no server round-trip."
      steps={[
        "Choose how much text you want and the unit — paragraphs, sentences, or words.",
        "Optionally keep the classic 'Lorem ipsum…' opening line.",
        "Click Generate, then copy or download the result.",
      ]}
      faq={[
        {
          question: "What is Lorem Ipsum?",
          answer:
            "It's scrambled, meaningless Latin-like text that has been the printing and design industry's standard placeholder since the 1500s. Because it isn't readable, it lets people judge layout and typography without being distracted by the content.",
        },
        {
          question: "Why use placeholder text instead of real content?",
          answer:
            "It lets designers and developers build and review a layout before final copy exists, and shows how a design copes with realistic amounts of text.",
        },
        {
          question: "Can I generate a specific number of words?",
          answer:
            "Yes — switch the unit to Words and enter the exact count you need, up to 100 units at a time.",
        },
        {
          question: "Can I download the generated text?",
          answer:
            "Yes — you can copy it to your clipboard or download it as a .txt file.",
        },
        {
          question: "Is it really free?",
          answer:
            "Yes, completely free with no signup and no limit on how many times you generate.",
        },
      ]}
    >
      <LoremIpsum />
    </ToolPageTemplate>
  );
}
