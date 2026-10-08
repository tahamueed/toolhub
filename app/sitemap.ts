import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { blogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/categories/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${siteConfig.url}/tools/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...blogRoutes];
}
