import { apiClient } from "@/src/lib/api/client";
import type {
  ProviderArticle,
  ProviderArticlePage,
  SubmitProviderArticle,
} from "../types/provider-article.types";

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const providerArticlesApi = {
  async listMine(accessToken: string): Promise<ProviderArticle[]> {
    const { data } = await apiClient<{ items: ProviderArticle[] }>(
      "/provider/articles",
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data.items;
  },

  async submit(input: SubmitProviderArticle, accessToken: string) {
    const { data } = await apiClient<ProviderArticle>("/provider/articles", {
      method: "POST",
      data: input,
      headers: authHeaders(accessToken),
    });
    return data;
  },

  async uploadCover(
    articleId: string,
    file: File,
    coverAlt: string,
    accessToken: string,
  ) {
    const form = new FormData();
    form.append("file", file);
    form.append("coverAlt", coverAlt);
    const { data } = await apiClient<Pick<
      ProviderArticle,
      "id" | "coverImage" | "coverAlt" | "status" | "updatedAt"
    >>(`/provider/articles/${articleId}/cover`, {
      method: "POST",
      data: form,
      headers: authHeaders(accessToken),
    });
    return data;
  },
};

export const publicProviderArticlesApi = {
  async list(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: string;
    specialtyId?: string;
  } = {}): Promise<ProviderArticlePage> {
    const params = new URLSearchParams({
      page: String(options.page ?? 1),
      pageSize: String(options.pageSize ?? 9),
    });
    if (options.search?.trim()) params.set("search", options.search.trim());
    if (options.categoryId) params.set("categoryId", options.categoryId);
    if (options.specialtyId) params.set("specialtyId", options.specialtyId);
    const { data } = await apiClient<ProviderArticlePage>(`/articles?${params}`, {
      method: "GET",
    });
    return data;
  },

  async getBySlug(slug: string): Promise<ProviderArticle> {
    const { data } = await apiClient<ProviderArticle>(
      `/articles/${encodeURIComponent(slug)}`,
      { method: "GET" },
    );
    return data;
  },

  async rate(
    articleId: string,
    rating: number,
    accessToken: string,
    comment?: string,
  ) {
    const { data } = await apiClient(
      `/articles/${articleId}/ratings`,
      {
        method: "POST",
        data: { rating, ...(comment?.trim() ? { comment: comment.trim() } : {}) },
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },
};
