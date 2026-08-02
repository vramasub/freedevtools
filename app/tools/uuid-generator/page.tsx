import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import UuidGenerator from "@/components/widgets/UuidGenerator";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("uuid-generator")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function UuidGeneratorPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="UUIDs (universally unique identifiers) are used everywhere in software development — as database primary keys, API request IDs, session tokens, and test data — precisely because they can be generated independently on different machines with virtually no chance of collision. This free UUID generator creates random version 4 UUIDs, the most common variant, using your browser's built-in cryptographically secure random number generator. Generate a single UUID or a batch at once, then copy them individually, copy the whole list, or download it as a text file. Nothing is sent to a server — each UUID is generated locally on your device."
      steps={[
        "Choose how many UUIDs you want.",
        "Click Generate.",
        "Copy an individual UUID, copy them all, or download the list as a text file.",
      ]}
      faq={[
        {
          question: "How random are these UUIDs?",
          answer:
            "They're generated using the browser's built-in crypto.randomUUID() function, which uses a cryptographically secure random number generator — the same standard used by v4 UUIDs everywhere.",
        },
        {
          question: "Can two generated UUIDs ever collide?",
          answer:
            "It's astronomically unlikely — v4 UUIDs have 122 random bits, so the chance of a collision is negligible even across trillions of IDs.",
        },
        {
          question: "What's the difference between UUID versions?",
          answer:
            "Version 4 (used here) is randomly generated and by far the most common in modern software. Other versions (like v1 or v5) derive the ID from a timestamp, MAC address, or a hash of a name — this tool only generates v4.",
        },
        {
          question: "Can I generate UUIDs in bulk?",
          answer: "Yes — choose a batch size from the dropdown, then copy or download the full list at once.",
        },
        {
          question: "Is this UUID generator free to use?",
          answer: "Yes, completely free with no limits on how many times you can generate UUIDs.",
        },
      ]}
    >
      <UuidGenerator />
    </ToolPageTemplate>
  );
}
