import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ServicesExplorer } from "@/src/features/catalog/components/services-explorer";

export const metadata: Metadata = {
  title: "دسته‌بندی خدمات | هلپر",
  description: "همه‌ی دسته‌بندی‌های خدمات هلپر را ببینید و متخصص موردنظرتان را پیدا کنید.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <main className="pb-16">
      <section className="border-b border-primary/10 bg-gradient-to-br from-primary/[0.13] via-background to-secondary py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles size={14} aria-hidden="true" />
              خدمات متنوع هلپر
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              چه کاری برایتان انجام دهیم؟
            </h1>
            <p className="mt-3 text-sm leading-7 text-foreground/65 sm:text-base">
              دسته‌ی موردنظرتان را پیدا کنید، خدمات و متخصصان مرتبط را ببینید و
              با آگاهی تصمیم بگیرید.
            </p>
          </div>
        </Container>
      </section>

      <Container className="pt-8 sm:pt-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-foreground/10 bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                انتخاب دسته‌ی خدمت
              </h2>
              <p className="mt-1 text-sm text-foreground/55">
                برای شروع، یکی از دسته‌ها را انتخاب کنید.
              </p>
            </div>
            <Link
              href="/request"
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-primary/20 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/[0.04] sm:self-auto"
            >
              نمی‌دانم کدام خدمت را انتخاب کنم
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          </div>
          <ServicesExplorer initialQuery={q} />
        </div>
      </Container>
    </main>
  );
}