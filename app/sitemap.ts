import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { tools } from "@/lib/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1, lastModified },
    { url: `${siteConfig.url}/tools`, changeFrequency: "weekly", priority: 0.9, lastModified },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.3, lastModified },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.3, lastModified },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2, lastModified },
    { url: `${siteConfig.url}/terms-of-service`, changeFrequency: "yearly", priority: 0.2, lastModified },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified,
  }));

  return [...staticPages, ...toolPages];
}
