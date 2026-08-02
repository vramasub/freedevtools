import Link from "next/link";
import { ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { categoryLabels, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";
import { categoryTheme } from "@/lib/theme";
import { toolIcons } from "@/lib/tool-icons";
import { buildOrganizationSchema } from "@/lib/seo";
import AdSlot from "@/components/layout/AdSlot";

const categories: ToolCategory[] = ["data", "image", "pdf", "utility"];

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <section className="border-b border-slate-200 bg-gradient-to-br from-violet-50 via-white to-rose-50">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Free developer tools that{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent">
              never leave your browser
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Convert, compress, and format files instantly. No sign-up, no uploads to a server —
            every tool runs entirely on your device.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              100% client-side processing
            </span>
            <span className="flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              Instant, no waiting on uploads
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {categories.map((category) => {
          const theme = categoryTheme[category];
          return (
            <section key={category} className="mb-12">
              <h2 className="text-xl font-semibold text-slate-900">{categoryLabels[category]}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getToolsByCategory(category).map((tool) => {
                  const Icon = toolIcons[tool.icon];
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className={`group flex flex-col justify-between rounded-xl border border-slate-200 p-5 transition-colors hover:shadow-sm ${theme.hoverBorder} ${theme.hoverBg}`}
                    >
                      <div>
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${theme.gradient}`}
                        >
                          <Icon size={20} />
                        </span>
                        <h3 className="mt-3 font-semibold text-slate-900">{tool.shortTitle}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">{tool.description}</p>
                      </div>
                      <span className={`mt-4 flex items-center gap-1 text-sm font-medium ${theme.chipText}`}>
                        Open tool <ArrowRight size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <AdSlot slotId="homepage-bottom" className="mt-4" />
      </div>
    </div>
  );
}
