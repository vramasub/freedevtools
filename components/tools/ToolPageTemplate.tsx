import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import type { ToolMeta } from "@/lib/tools-registry";
import { categoryLabels } from "@/lib/tools-registry";
import { categoryTheme } from "@/lib/theme";
import { toolIcons } from "@/lib/tool-icons";
import { buildBreadcrumbSchema, buildSoftwareApplicationSchema } from "@/lib/seo";
import FAQSection, { type FAQItem } from "@/components/tools/FAQSection";
import RelatedTools from "@/components/tools/RelatedTools";
import AdSlot from "@/components/layout/AdSlot";

interface ToolPageTemplateProps {
  tool: ToolMeta;
  intro: string;
  steps: string[];
  faq: FAQItem[];
  children: ReactNode;
}

export default function ToolPageTemplate({
  tool,
  intro,
  steps,
  faq,
  children,
}: ToolPageTemplateProps) {
  const theme = categoryTheme[tool.category];
  const Icon = toolIcons[tool.icon];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareApplicationSchema(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(tool)) }}
      />
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white ${theme.gradient}`}>
          <Icon size={22} />
        </span>
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${theme.chipBg} ${theme.chipText}`}
        >
          {categoryLabels[tool.category]}
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{tool.title}</h1>
      <p className="mt-3 text-base leading-7 text-slate-600">{intro}</p>

      <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
        <ShieldCheck size={16} />
        Processed entirely in your browser — your files are never uploaded anywhere.
      </p>

      <div className="mt-8">{children}</div>

      <AdSlot slotId="tool-page-mid" className="my-10" />

      {steps.length > 0 && (
        <section aria-labelledby="how-it-works-heading" className="mt-4">
          <h2 id="how-it-works-heading" className="text-xl font-semibold text-slate-900">
            How to use this tool
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <FAQSection items={faq} />
      <RelatedTools slug={tool.slug} />

      <AdSlot slotId="tool-page-bottom" className="mt-10" />
    </div>
  );
}
