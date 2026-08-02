import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contact</h1>
      <p className="mt-4 text-base leading-7 text-slate-700">
        Questions, bug reports, tool requests, or anything else — we&apos;d like to hear from you.
      </p>

      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Mail size={16} />
        {siteConfig.contactEmail}
      </a>

      <p className="mt-6 text-sm text-slate-500">
        We aim to respond within a few business days.
      </p>
    </div>
  );
}
