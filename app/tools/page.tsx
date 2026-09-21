import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryLabels, categoryOrder, getToolsByCategory } from "@/lib/tools-registry";
import { buildPageMetadata } from "@/lib/seo";
import { categoryTheme } from "@/lib/theme";
import { toolIcons } from "@/lib/tool-icons";

const categories = categoryOrder;

export const metadata: Metadata = buildPageMetadata({
  title: "All Tools",
  description: "Browse every free, browser-based developer tool: data converters, image tools, and PDF tools.",
  path: "/tools",
});

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Tools</h1>
      <p className="mt-2 text-slate-600">
        Every tool below runs entirely in your browser — nothing you upload is ever sent to a
        server.
      </p>

      {categories.map((category) => {
        const theme = categoryTheme[category];
        return (
          <section key={category} className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <span className={`h-2.5 w-2.5 rounded-full ${theme.gradient}`} />
              {categoryLabels[category]}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {getToolsByCategory(category).map((tool) => {
                const Icon = toolIcons[tool.icon];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className={`flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors ${theme.hoverBorder} ${theme.hoverBg}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white ${theme.gradient}`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="flex-1">{tool.shortTitle}</span>
                      <ArrowRight size={16} className="shrink-0 text-slate-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
