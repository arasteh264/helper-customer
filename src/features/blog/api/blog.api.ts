import { apiClient } from "@/src/lib/api/client";
import type { BlogArticle, BlogPage } from "../types/blog.types";

export const blogApi = {
  async list(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<BlogPage> {
    const params = new URLSearchParams({
      page: String(options.page ?? 1),
      pageSize: String(options.pageSize ?? 9),
    });
    if (options.search?.trim()) params.set("search", options.search.trim());
    if (options.category) params.set("category", options.category);
    if (options.tag) params.set("tag", options.tag);
    const { data } = await apiClient<BlogPage>(`/blog?${params}`, {
      method: "GET",
    });
    return data;
  },

  async getBySlug(slug: string): Promise<BlogArticle> {
    const { data } = await apiClient<BlogArticle>(
      `/blog/${encodeURIComponent(slug)}`,
      { method: "GET" },
    );
    return data;
  },
};
