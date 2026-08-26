import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedTools, getToolBySlug } from "@/lib/tools-registry";
import { categoryTheme } from "@/lib/theme";

export default function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  const current = getToolBySlug(slug);
  if (related.length === 0 || !current) return null;

  const theme = categoryTheme[current.category];

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2
        id="related-heading"
        className="text-xl font-semibold text-[#14140F]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Related tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className={`flex items-center justify-between rounded-lg border border-[#14140F]/15 px-4 py-3 text-sm font-medium text-[#14140F]/80 transition-colors ${theme.hoverBorder} ${theme.hoverBg} ${theme.linkHover}`}
            >
              {tool.shortTitle}
              <ArrowRight size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
