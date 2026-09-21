import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ColorPicker from "@/components/widgets/ColorPicker";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("color-picker")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function ColorPickerPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="Designers and developers constantly need to move a color between formats — a designer hands you a HEX code but your CSS uses rgb(), or you need the HSL value to nudge a color's lightness. This free color picker lets you choose a color visually or type a HEX code, then instantly gives you its HEX, RGB, and HSL values, each copyable with one click. It accepts both shorthand (#abc) and full (#aabbcc) hex, and everything runs locally in your browser."
      steps={[
        "Pick a color with the swatch, or type a HEX value.",
        "See the matching RGB and HSL values update instantly.",
        "Copy whichever format your project needs.",
      ]}
      faq={[
        {
          question: "What's the difference between HEX, RGB, and HSL?",
          answer:
            "They all describe the same color differently. HEX and RGB both specify red, green, and blue amounts (HEX in base-16, RGB in 0–255). HSL describes hue, saturation, and lightness, which makes it easier to adjust a color intuitively.",
        },
        {
          question: "Does it accept shorthand hex like #abc?",
          answer:
            "Yes — three-digit shorthand is automatically expanded to its six-digit equivalent (#abc becomes #aabbcc) before conversion.",
        },
        {
          question: "How do I convert HEX to RGB?",
          answer:
            "Type or pick your hex color and the RGB value appears instantly below it, ready to copy as an rgb(...) string for CSS.",
        },
        {
          question: "Why is my hex value showing an error?",
          answer:
            "The input must be a valid 3- or 6-digit hex code, optionally starting with #. Characters outside 0–9 and A–F aren't valid hex.",
        },
        {
          question: "Is my color data sent anywhere?",
          answer: "No — all conversion happens in your browser. Nothing is uploaded.",
        },
      ]}
    >
      <ColorPicker />
    </ToolPageTemplate>
  );
}
