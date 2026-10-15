import type { ContentBlock } from "@/src/features/blog/types/blog.types";

export type ProviderArticleStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface ProviderArticleSpecialty {
  id: string;
  name: string;
  slug: string;
  group?: { id: string; name: string; slug: string };
}

export interface ProviderArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: ContentBlock[];
  coverImage: string | null;
  coverAlt: string | null;
  readingMinutes: number;
  status?: ProviderArticleStatus;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
  categories?: { id: string; name: string; slug: string }[];
  specialties?: ProviderArticleSpecialty[];
  ratingSummary?: { average: number | null; count: number };
}

export interface ProviderArticlePage {
  items: ProviderArticle[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubmitProviderArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: ContentBlock[];
  specialtyIds: string[];
  categoryIds: string[];
  readingMinutes?: number;
}
