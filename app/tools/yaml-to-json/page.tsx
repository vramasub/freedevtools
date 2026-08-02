import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import JsonYamlConverter from "@/components/widgets/JsonYamlConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("yaml-to-json")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function YamlToJsonPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Configuration files are often written in YAML for readability, but scripts, APIs, and many programming languages work more naturally with JSON. This free YAML to JSON converter takes YAML — from a Kubernetes manifest, a CI/CD pipeline file, or any config file — and converts it to equivalent JSON you can feed into a script, log for debugging, or send to an API that doesn't understand YAML. It supports standard YAML mappings, sequences, and scalars, and runs entirely in your browser, so you can convert configuration files without uploading them anywhere."
      steps={[
        "Paste your YAML into the left box, or upload a .yaml/.yml file.",
        "Click Convert.",
        "Copy the JSON output or download it as a .json file.",
      ]}
      faq={[
        {
          question: "Does this support multi-document YAML?",
          answer:
            "This tool converts a single YAML document. If your file has multiple documents separated by \"---\", convert them one at a time.",
        },
        {
          question: "What YAML features are supported?",
          answer:
            "Standard mappings, sequences, scalars, and comments are supported. Anchors and aliases are resolved to their expanded values in the JSON output.",
        },
        {
          question: "Why would I need to convert YAML to JSON?",
          answer:
            "Common cases include feeding a YAML config into a script or language that only parses JSON, debugging a config file's actual structure, or passing config data to an API that expects JSON.",
        },
        {
          question: "Does it handle YAML comments?",
          answer:
            "Comments are stripped during conversion, since JSON has no comment syntax — only the actual data structure carries over.",
        },
        {
          question: "Is my configuration file uploaded to a server?",
          answer: "No — the parsing happens entirely in your browser. Your YAML file never leaves your device.",
        },
      ]}
    >
      <JsonYamlConverter mode="yaml-to-json" />
    </ToolPageTemplate>
  );
}
