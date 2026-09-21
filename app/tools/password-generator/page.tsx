import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import PasswordGenerator from "@/components/widgets/PasswordGenerator";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("password-generator")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function PasswordGeneratorPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="A strong password is long and random — exactly the kind humans are bad at inventing and remembering. This free password generator creates strong, random passwords right in your browser using crypto.getRandomValues, the same cryptographically secure random source browsers use for security-sensitive work. Choose the length and which character types to include — lowercase, uppercase, numbers, symbols — and optionally exclude look-alike characters like the letter O and the number 0. Because generation happens entirely on your device, the password is never transmitted to or logged by any server. For accounts you care about, pair a generated password with a password manager so you don't have to remember it."
      steps={[
        "Set the length with the slider.",
        "Choose which character types to include.",
        "Copy your password, or click regenerate for a new one.",
      ]}
      faq={[
        {
          question: "Are these passwords actually random and secure?",
          answer:
            "Yes — they're generated with crypto.getRandomValues, the browser's cryptographically secure random number generator, using rejection sampling to avoid statistical bias. That's far stronger than typical Math.random-based generators.",
        },
        {
          question: "Is the password sent to a server?",
          answer:
            "No. Everything happens locally in your browser and nothing is transmitted, logged, or stored. You can confirm this in your browser's Network tab — there are no requests when you generate a password.",
        },
        {
          question: "How long should my password be?",
          answer:
            "Longer is stronger. 16 characters with mixed types is a solid default for most accounts; go longer for high-value ones. The strength meter updates as you adjust the settings.",
        },
        {
          question: "What does 'exclude look-alikes' do?",
          answer:
            "It removes visually confusable characters like O/0 and l/1, which makes a password easier to read and type correctly, at a small cost to the pool of possible characters.",
        },
        {
          question: "Should I reuse a generated password?",
          answer:
            "No — use a unique password for every account, and store them in a password manager so you don't have to memorize them.",
        },
      ]}
    >
      <PasswordGenerator />
    </ToolPageTemplate>
  );
}
