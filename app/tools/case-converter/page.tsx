import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import CaseConverter from "@/components/widgets/CaseConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("case-converter")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function CaseConverterPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Renaming a batch of variables, cleaning up a title that arrived in ALL CAPS, or turning a label into a slug — changing the case of text by hand is tedious and easy to get wrong. This free case converter transforms your text into nine common formats at once: UPPERCASE, lowercase, Title Case, Sentence case, and the programmer-friendly camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. Type or paste once and copy whichever version you need. It runs entirely in your browser, so nothing you paste is ever uploaded to a server."
      steps={[
        "Type or paste your text into the box.",
        "See it converted into every case format instantly.",
        "Click the copy icon next to the format you want.",
      ]}
      faq={[
        {
          question: "What's the difference between camelCase and PascalCase?",
          answer:
            "Both remove spaces and capitalize word boundaries. camelCase leaves the first letter lowercase (myVariableName); PascalCase capitalizes it too (MyVariableName). camelCase is common for variables, PascalCase for class and component names.",
        },
        {
          question: "How does it split words for snake_case and kebab-case?",
          answer:
            "It breaks on spaces, punctuation, underscores, hyphens, and existing camelCase boundaries, then joins with an underscore or hyphen. So 'myVariable name' becomes my_variable_name or my-variable-name.",
        },
        {
          question: "What is Title Case versus Sentence case?",
          answer:
            "Title Case capitalizes the first letter of every word. Sentence case capitalizes only the first letter of each sentence, leaving the rest lowercase.",
        },
        {
          question: "Does it change my original text?",
          answer:
            "No — your input stays exactly as you typed it. Each converted version is generated separately for you to copy.",
        },
        {
          question: "Is anything uploaded?",
          answer:
            "No. All conversions run locally in your browser, so your text never leaves your device.",
        },
      ]}
    >
      <CaseConverter />
    </ToolPageTemplate>
  );
}
