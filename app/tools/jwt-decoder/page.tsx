import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import JwtDecoder from "@/components/widgets/JwtDecoder";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildToolMetadata } from "@/lib/seo";

const tool = getToolBySlug("jwt-decoder")!;
export const metadata: Metadata = buildToolMetadata(tool);

export default function JwtDecoderPage() {
  return (
    <ToolPageTemplate
      tool={tool}
      intro="JSON Web Tokens (JWTs) are widely used for authentication and authorization in modern web apps and APIs, encoding claims like a user ID, permissions, and an expiry time into a compact, URL-safe string. This free JWT decoder lets you paste a token and instantly see its decoded header and payload as readable JSON, along with human-readable issued and expiry times when those claims are present — useful for debugging an authentication flow or inspecting what a token actually contains. Because JWTs are only base64url-encoded (not encrypted), decoding requires no secret key — and since this tool runs entirely in your browser, your token is never sent to a server, unlike many online JWT debuggers."
      steps={[
        "Paste a JWT into the box below.",
        "The header and payload are decoded automatically.",
        "Review the claims, issued time, and expiry.",
      ]}
      faq={[
        {
          question: "Does this verify the token's signature?",
          answer:
            "No — verifying a signature requires the issuer's secret or public key, which this tool never asks you for. This tool only decodes the header and payload, which are readable by anyone without any key (that's how JWTs work by design).",
        },
        {
          question: "Is it safe to paste a real token here?",
          answer:
            "Yes — decoding happens entirely in your browser and the token is never sent anywhere. That said, treat tokens like passwords in general and avoid pasting production tokens into any website unnecessarily.",
        },
        {
          question: "Can I decode a JWT without knowing the signing secret?",
          answer:
            "Yes — the header and payload of a JWT are just base64url-encoded JSON, readable by anyone without any key. Only verifying the signature (confirming the token is authentic) requires the secret or public key.",
        },
        {
          question: "What does the 'exp' claim mean?",
          answer:
            "The 'exp' (expiration) claim is a Unix timestamp indicating when the token stops being valid — this tool converts it to a human-readable date and time automatically when present.",
        },
        {
          question: "Why should I be careful pasting tokens into online tools?",
          answer:
            "A JWT often grants access to an account or API — treat it like a password. This tool processes tokens entirely client-side and never transmits them, but it's still good practice to avoid pasting real production tokens into any website unless necessary.",
        },
      ]}
    >
      <JwtDecoder />
    </ToolPageTemplate>
  );
}
