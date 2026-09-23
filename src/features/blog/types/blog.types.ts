export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; text: string };

export interface Author {
  name: string;
  role: string;
}

export interface BlogCategory {
  id: string;
  label: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string;
  author: Author;
  publishedAt: string; // ISO
  readingMinutes: number;
  /** رنگ گرادیان کاور به‌جای عکس واقعی */
  coverTint: string;
  content: ContentBlock[];
}