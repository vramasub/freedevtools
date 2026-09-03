import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  path: "/contact",
});

const displayFont = { fontFamily: "var(--font-space-grotesk)" };
const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6" style={bodyFont}>
      <h1 className="text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
        Contact
      </h1>
      <p className="mt-4 text-base leading-7 text-[#14140F]/70">
        Questions, bug reports, tool requests, or anything else — I&apos;d like to hear from you.
      </p>

      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#14140F] px-5 py-2.5 text-sm font-semibold text-[#FAF9F5] hover:bg-[#14140F]/85"
      >
        <Mail size={16} />
        {siteConfig.contactEmail}
      </a>

      <p className="mt-6 text-sm text-[#14140F]/50">
        I aim to respond within a few business days.
      </p>
    </div>
  );
}
