import { ApiError, ApiErrorCode } from "@/src/lib/api/error";
import { API_BASE_URL } from "@/src/lib/api/base-url";
import type { BlogArticle, BlogPage } from "../types/blog.types";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300, tags: ["blog"] },
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(error?.message)
      ? error.message.join("، ")
      : error?.message;
    throw new ApiError(
      ApiErrorCode.UNKNOWN_ERROR,
      message ?? "دریافت محتوای وبلاگ ناموفق بود.",
      response.status,
    );
  }
  return (await response.json()) as T;
}

export const blogServerApi = {
  list(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    tag?: string;
  } = {}) {
    const params = new URLSearchParams({
      page: String(options.page ?? 1),
      pageSize: String(options.pageSize ?? 9),
    });
    if (options.search?.trim()) params.set("search", options.search.trim());
    if (options.category) params.set("category", options.category);
    if (options.tag) params.set("tag", options.tag);
    return getJson<BlogPage>(`/blog?${params}`);
  },

  getBySlug(slug: string) {
    return getJson<BlogArticle>(`/blog/${encodeURIComponent(slug)}`);
  },
};
