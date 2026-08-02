import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import JsonYamlConverter from "@/components/widgets/JsonYamlConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-to-yaml")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JsonToYamlPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="YAML has become the standard format for Kubernetes manifests, Docker Compose files, GitHub Actions workflows, and countless other configuration files — but many tools and APIs still output JSON. This free JSON to YAML converter bridges that gap, turning JSON into clean, properly-indented YAML you can drop straight into a config file. It preserves key order and correctly represents arrays as YAML block sequences, so the structure of your data doesn't change — only the syntax does. Everything runs locally in your browser, so configuration files containing internal service names never get uploaded anywhere."
      steps={[
        "Paste your JSON into the left box, or upload a .json file.",
        "Click Convert.",
        "Copy the YAML output or download it as a .yaml file.",
      ]}
      faq={[
        {
          question: "Does this preserve key order?",
          answer: "Yes, object keys keep the same order they appear in your JSON input.",
        },
        {
          question: "How are arrays represented?",
          answer: "Arrays are converted to standard YAML block sequences (lines starting with a dash).",
        },
        {
          question: "Can I use this to create a Kubernetes YAML manifest from JSON?",
          answer:
            "Yes — this is a common use case. Paste your JSON resource definition and the converter outputs valid YAML you can save directly as a .yaml manifest.",
        },
        {
          question: "Does it handle nested objects and arrays correctly?",
          answer:
            "Yes, nested structures are fully supported and rendered as nested YAML mappings and sequences, matching the original JSON structure exactly.",
        },
        {
          question: "Is this safe for config files containing secrets?",
          answer:
            "The conversion happens entirely in your browser, so nothing is uploaded — but as a general practice, avoid pasting real production secrets into any online tool, including this one, and use placeholder values where possible.",
        },
      ]}
    >
      <JsonYamlConverter mode="json-to-yaml" />
    </ToolPageTemplate>
  );
}
