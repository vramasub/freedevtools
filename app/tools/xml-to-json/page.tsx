import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import XmlJsonConverter from "@/components/widgets/XmlJsonConverter";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("xml-to-json")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function XmlToJsonPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="XML is still common in enterprise systems, SOAP APIs, RSS feeds, and older configuration formats, but modern JavaScript and most REST APIs work in JSON. This free XML to JSON converter parses your XML and produces equivalent JSON, preserving element attributes as separate keys so you don't lose information in the conversion. It's useful for debugging an XML API response, migrating legacy XML data into a JSON-based system, or just making XML easier to read. As with every tool here, conversion happens entirely in your browser — your XML document is never uploaded to a server."
      steps={[
        "Paste your XML into the left box, or upload an .xml file.",
        "Click Convert.",
        "Copy the JSON output or download it as a .json file.",
      ]}
      faq={[
        {
          question: "How are XML attributes represented in the JSON?",
          answer:
            'Attributes are included as keys prefixed with "@_", e.g. <item id="1"> becomes {"@_id": "1"}, to distinguish them from child elements.',
        },
        {
          question: "Is this conversion perfectly reversible?",
          answer:
            "XML and JSON have different structural rules (e.g. XML allows mixed text and element content, JSON does not), so highly complex XML may not round-trip perfectly. Most typical data XML converts cleanly.",
        },
        {
          question: "Can I convert a SOAP XML response to JSON?",
          answer:
            "Yes — paste the XML body of a SOAP response and it will convert to JSON, though deeply nested SOAP envelopes may benefit from further reshaping depending on your use case.",
        },
        {
          question: "What happens to XML namespaces?",
          answer:
            "Namespace prefixes are preserved as part of the element and attribute names in the resulting JSON keys, since JSON has no native namespace concept.",
        },
        {
          question: "Is there a size limit for the XML file?",
          answer:
            "No artificial limit — since parsing happens in your browser rather than on a server, the practical limit is your device's available memory.",
        },
      ]}
    >
      <XmlJsonConverter mode="xml-to-json" />
    </ToolPageTemplate>
  );
}
