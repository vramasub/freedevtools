import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { categoryLabels, type ToolCategory, type ToolMeta } from "@/lib/tools-registry";

export function buildToolMetadata(tool: ToolMeta): Metadata {
  const url = `${siteConfig.url}/tools/${tool.slug}`;
  return {
    // The root layout's title.template already appends " | {siteName}" — don't duplicate it here.
    title: `${tool.title} — Free & Private`,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.title,
      description: tool.description,
    },
  };
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${opts.path}`;
  return {
    // The root layout's title.template already appends " | {siteName}" — don't duplicate it here.
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

const categoryToApplicationCategory: Record<ToolCategory, string> = {
  data: "DeveloperApplication",
  utility: "DeveloperApplication",
  image: "UtilitiesApplication",
  pdf: "UtilitiesApplication",
};

export function buildSoftwareApplicationSchema(tool: ToolMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    description: tool.description,
    applicationCategory: categoryToApplicationCategory[tool.category],
    operatingSystem: "Any (runs in a web browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildBreadcrumbSchema(tool: ToolMeta) {
  const items = [
    { name: siteConfig.name, url: siteConfig.url },
    { name: "Tools", url: `${siteConfig.url}/tools` },
    { name: categoryLabels[tool.category], url: `${siteConfig.url}/tools` },
    { name: tool.shortTitle, url: `${siteConfig.url}/tools/${tool.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}
