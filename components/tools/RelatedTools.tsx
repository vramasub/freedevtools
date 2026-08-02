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
      <h2 id="related-heading" className="text-xl font-semibold text-slate-900">
        Related tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className={`flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors ${theme.hoverBorder} ${theme.hoverBg} ${theme.linkHover}`}
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
