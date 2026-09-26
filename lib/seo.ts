import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { categoryLabels, type ToolCategory, type ToolMeta } from "@/lib/tools-registry";
import type { GuideMeta } from "@/lib/guides-registry";

// A page that sets its own `openGraph` object (as every tool/guide/static page does, via
// the builders below) doesn't inherit the root `app/opengraph-image.tsx` file-convention
// image — Next only falls back to it for routes with no openGraph object of their own.
// So every builder here has to reference it explicitly, or the page gets no share image.
const defaultOgImages = [{ url: "/opengraph-image", width: 1200, height: 630 }];

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
      images: defaultOgImages,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: defaultOgImages.map((image) => image.url),
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
      images: defaultOgImages,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: defaultOgImages.map((image) => image.url),
    },
  };
}

const categoryToApplicationCategory: Record<ToolCategory, string> = {
  data: "DeveloperApplication",
  text: "UtilitiesApplication",
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

export function buildArticleSchema(guide: GuideMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${siteConfig.url}/guides/${guide.slug}`,
    datePublished: guide.publishedAt,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
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
