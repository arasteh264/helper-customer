import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { BlogExplorer } from "@/src/features/blog/components/blog-explorer";
import { blogServerApi } from "@/src/features/blog/api/blog.server";
import { publicProviderArticlesApi } from "@/src/features/articles/api/provider-articles.api";
import { ExpertArticlesSection } from "@/src/features/articles/components/expert-articles-section";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://helper-customer.vercel.app";

const baseMetadata: Metadata = {
  title: "دانستنی‌ها و مقاله‌های تخصصی | هلپا24",
  description:
    "دانستنی‌های کاربردی برای نگهداری خانه و انتخاب آگاهانه‌ی متخصص در هلپا24.",
};

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  if (params.category || params.tag || params.search) {
    return {
      ...baseMetadata,
      alternates: { canonical: `${siteUrl}/blog` },
      robots: { index: false, follow: true },
    };
  }
  return {
    ...baseMetadata,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category?.slice(0, 100);
  const initialTag = params.tag?.slice(0, 100);
  const initialSearch = params.search?.slice(0, 100) ?? "";
  let initialPage;
  let initialError = false;
  try {
    initialPage = await blogServerApi.list({
      page: 1,
      pageSize: 9,
      category: initialCategory,
      tag: initialTag,
      search: initialSearch,
    });
  } catch {
    initialError = true;
    initialPage = { items: [], total: 0, page: 1, pageSize: 9, categories: [] };
  }
  let expertArticles = [];
  let expertArticlesError = false;
  try {
    expertArticles = (await publicProviderArticlesApi.list({ page: 1, pageSize: 6 })).items;
  } catch (error) {
    console.error("Failed to load approved provider articles.", error);
    expertArticlesError = true;
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8 rounded-3xl bg-secondary/70 px-6 py-8 sm:px-10 sm:py-10">
          <span className="text-sm font-semibold text-primary">مجله‌ی هلپا24</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            دانستنی‌ها برای انتخاب بهتر و نگهداری خانه
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
            راهنماهای کاربردی را بخوانید؛ از انتخاب متخصص مناسب تا نکته‌هایی که
            پیش از تعمیر و نگهداری خانه به کارتان می‌آیند.
          </p>
        </div>

        <BlogExplorer
          initialPage={initialPage}
          initialError={initialError}
          initialCategory={initialCategory}
          initialTag={initialTag}
          initialSearch={initialSearch}
        />
        <ExpertArticlesSection
          articles={expertArticles}
          error={expertArticlesError}
        />
      </Container>
    </div>
  );
}