import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { categoryLabels, categoryOrder, getToolsByCategory, tools } from "@/lib/tools-registry";
import { categoryTheme } from "@/lib/theme";
import { toolIcons } from "@/lib/tool-icons";
import { buildOrganizationSchema } from "@/lib/seo";
import AdSlot from "@/components/layout/AdSlot";
import HeroDemo from "@/components/home/HeroDemo";

const categories = categoryOrder;

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <section className="border-b border-[#14140F]/10 bg-[#FAF9F5]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.14em] text-[#14140F]/50"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {tools.length} tools · runs entirely on this device
            </p>
            <h1
              className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#14140F] sm:text-6xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Convert anything.
              <br />
              Upload nothing.
            </h1>
            <p
              className="mt-5 max-w-lg text-lg leading-7 text-[#14140F]/70"
              style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
            >
              CSV, JSON, PNG, PDF, and more — reshaped instantly in your browser. No server ever
              sees your file.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-lg bg-[#14140F] px-5 py-3 text-sm font-semibold text-[#FAF9F5] transition-colors hover:bg-[#14140F]/85"
              >
                Browse all tools <ArrowRight size={16} />
              </Link>
              <span className="flex items-center gap-2 text-sm text-[#14140F]/60">
                <ShieldCheck size={16} className="text-[#0E7A5F]" />
                Nothing is ever uploaded
              </span>
            </div>
          </div>
          <HeroDemo />
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
