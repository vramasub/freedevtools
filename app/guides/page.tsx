import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Guides",
  description:
    "Plain-English explanations of the formats and concepts behind our tools — CSV vs JSON, Base64, UUIDs, and more.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  const displayFont = { fontFamily: "var(--font-space-grotesk)" };
  const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6" style={bodyFont}>
      <h1 className="text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
        Guides
      </h1>
      <p className="mt-2 text-[#14140F]/70">
        Plain-English explanations of the formats and concepts behind our tools — not marketing
        copy, just what you actually need to know to make the right call.
      </p>

      <ul className="mt-8 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="block rounded-lg border border-[#14140F]/15 p-5 transition-colors hover:border-[#14140F]/30 hover:bg-[#14140F]/[0.02]"
            >
              <h2 className="font-semibold text-[#14140F]" style={displayFont}>
                {guide.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-[#14140F]/70">{guide.description}</p>
              <span className="mt-3 flex items-center gap-1 text-sm font-medium text-[#4438CA]">
                Read guide <ArrowRight size={14} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
