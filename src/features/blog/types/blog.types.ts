export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; text: string };

export interface Author {
  name: string;
  role: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  authorName: string;
  authorRole: string;
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
  coverTint: string;
  coverImage: string | null;
  coverAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  tags: string[];
  content: ContentBlock[];
}

export type BlogArticleSummary = Omit<BlogArticle, "content">;

export interface BlogPage {
  items: BlogArticleSummary[];
  total: number;
  page: number;
  pageSize: number;
  categories: { category: string; categorySlug: string }[];
}