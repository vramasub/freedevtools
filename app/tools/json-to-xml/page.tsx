import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import XmlJsonConverter from "@/components/widgets/XmlJsonConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-to-xml")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JsonToXmlPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Some legacy systems, SOAP-based APIs, and enterprise integrations still require XML rather than JSON. This free JSON to XML converter takes a JSON object and produces well-formed, properly indented XML you can use directly. Use &quot;@_&quot;-prefixed keys in your JSON to control which values become XML attributes rather than child elements, giving you control over the output structure. The conversion runs entirely in your browser, so JSON data — including anything sensitive — is never sent to a server."
      steps={[
        "Paste your JSON into the left box, or upload a .json file.",
        "Click Convert.",
        "Copy the XML output or download it as an .xml file.",
      ]}
      faq={[
        {
          question: "How do I produce XML attributes?",
          answer:
            'Use keys prefixed with "@_" in your JSON, e.g. {"item": {"@_id": "1"}} becomes <item id="1">.',
        },
        {
          question: "What happens with a JSON array at the top level?",
          answer:
            "Since XML requires a single root element, wrap your array in an object with one key before converting, e.g. {\"items\": {\"item\": [...]}}",
        },
        {
          question: "Why does XML need a single root element?",
          answer:
            "XML documents can only have one top-level element, unlike JSON which allows arrays or objects at the root — that's why a JSON array needs to be wrapped in an object first.",
        },
        {
          question: "Does this escape special characters automatically?",
          answer:
            "Yes, characters like less-than, greater-than, and ampersand are automatically escaped in text content so the resulting XML is valid.",
        },
        {
          question: "Can I convert the XML back to JSON afterward?",
          answer: "Yes — use our XML to JSON converter to reverse the conversion.",
        },
      ]}
    >
      <XmlJsonConverter mode="json-to-xml" />
    </ToolPageTemplate>
  );
}
