import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { GuideMeta } from "@/lib/guides-registry";
import { getToolBySlug } from "@/lib/tools-registry";
import { buildArticleSchema } from "@/lib/seo";
import AdSlot from "@/components/layout/AdSlot";

interface GuideTemplateProps {
  guide: GuideMeta;
  children: ReactNode;
}

export default function GuideTemplate({ guide, children }: GuideTemplateProps) {
  const displayFont = { fontFamily: "var(--font-space-grotesk)" };
  const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };
  const relatedTools = guide.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<typeof tool> => !!tool);
  const publishedDate = new Date(guide.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#FAF9F5]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(guide)) }}
        />
        <p
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#4438CA]"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <BookOpen size={14} />
          Guide
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
          {guide.title}
        </h1>
        <p className="mt-2 text-sm text-[#14140F]/50" style={bodyFont}>
          Published {publishedDate}
        </p>

        <div className="mt-8 space-y-5 text-base leading-7 text-[#14140F]/80" style={bodyFont}>
          {children}
        </div>

        {relatedTools.length > 0 && (
          <div className="mt-12 rounded-lg border border-[#14140F]/15 p-5" style={bodyFont}>
            <p className="text-sm font-semibold text-[#14140F]">Try the tools mentioned here</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between rounded-md border border-[#14140F]/10 px-3 py-2 text-sm font-medium text-[#14140F]/80 hover:border-[#4438CA]/40 hover:text-[#4438CA]"
                  >
                    {tool.shortTitle}
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <AdSlot slotId="guide-page-bottom" className="mt-10" />
      </div>
    </div>
  );
}
