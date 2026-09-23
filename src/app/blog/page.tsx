import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { BlogExplorer } from "@/src/features/blog/components/blog-explorer";

export const metadata: Metadata = {
  title: "وبلاگ هلپر | راهنمای نگهداری خانه و انتخاب متخصص",
  description: "مقالات تخصصی درباره‌ی نگهداری خانه، لوله‌کشی، برق‌کاری و نکات انتخاب متخصص.",
};

export default function BlogPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">وبلاگ هلپر</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-foreground/60">
            راهنما، نکات نگهداری خانه و تجربه‌های واقعی، برای مشتریان و متخصصان.
          </p>
        </div>

        <BlogExplorer />
      </Container>
    </div>
  );
}