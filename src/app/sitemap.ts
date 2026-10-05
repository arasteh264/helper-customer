import type { MetadataRoute } from "next";
import { blogServerApi } from "@/src/features/blog/api/blog.server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://helper-customer.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/services",
    "/specialists",
    "/blog",
    "/about",
    "/become-provider",
  ].map((path) => ({
    url: new URL(path || "/", siteUrl).toString(),
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = [];
  let page = 1;
  let total = 0;
  do {
    const result = await blogServerApi.list({ page, pageSize: 50 });
    total = result.total;
    for (const article of result.items) {
      articles.push({
        url:
          article.canonicalUrl ||
          new URL(`/blog/${article.slug}`, siteUrl).toString(),
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    page += 1;
  } while (articles.length < total && page <= 1000);

  return [...staticRoutes, ...articles];
}
