import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { BlogExplorer } from "@/src/features/blog/components/blog-explorer";
import { blogServerApi } from "@/src/features/blog/api/blog.server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://helper-customer.vercel.app";

const baseMetadata: Metadata = {
  title: "وبلاگ هلپر | راهنمای نگهداری خانه و انتخاب متخصص",
  description:
    "راهنمای انتخاب لوله‌کش و متخصص، نکات کاربردی لوله‌کشی و نگهداری خانه، و روش‌های مقایسه‌ی پیشنهادها در هلپر.",
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

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8 rounded-3xl bg-secondary/70 px-6 py-8 sm:px-10 sm:py-10">
          <span className="text-sm font-semibold text-primary">مجله‌ی هلپر</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            راهنمای انتخاب متخصص و نگهداری خانه
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
            جواب سؤال‌های روزمره‌تان را پیدا کنید؛ از این‌که چطور لوله‌کش مناسب
            پیدا کنید تا کارهایی که پیش از تعمیر باید بدانید.
          </p>
        </div>

        <BlogExplorer
          initialPage={initialPage}
          initialError={initialError}
          initialCategory={initialCategory}
          initialTag={initialTag}
          initialSearch={initialSearch}
        />
      </Container>
    </div>
  );
}