import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { SpecialistsDirectory } from "@/src/features/catalog/components/specialists-directory";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import { requestApi } from "@/src/features/request/api/request.api";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "متخصصان هلپر | جستجو و فیلتر",
  description:
    "متخصصان تأییدشده را بر اساس دسته، شهر و امتیاز فیلتر و مقایسه کنید.",
};

export default async function SpecialistsPage() {
  let specialists: DirectorySpecialist[] = [];
  let specialistsTotal = 0;
  let categories: { id: string; label: string }[] = [];
  let specialistsLoadFailed = false;
  let categoriesLoadFailed = false;
  const [providersResult, groupsResult] = await Promise.allSettled([
    publicProvidersApi.listPage(1, 24),
    requestApi.getSpecialtyGroups(),
  ]);

  if (providersResult.status === "fulfilled") {
    specialists = providersResult.value.items.map(mapPublicProvider);
    specialistsTotal = providersResult.value.total;
  } else {
    specialistsLoadFailed = true;
  }
  if (groupsResult.status === "fulfilled") {
    categories = groupsResult.value.map(({ id, name }) => ({
      id,
      label: name,
    }));
  } else {
    categoriesLoadFailed = true;
  }

  return (
    <main className="pb-16">
      <section className="relative isolate overflow-hidden border-b border-primary/10 bg-gradient-to-br from-[#e6f1ec] via-background to-[#f2eee4] py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-32 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground/50">
                <Link href="/" className="transition-colors hover:text-primary">
                  خانه
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground/75">متخصصان</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <Sparkles size={14} aria-hidden="true" />
                انتخاب آگاهانه، شروع مطمئن
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                متخصص مناسب کارتان را پیدا کنید
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
                تخصص، امتیاز، سوابق و محدوده‌ی فعالیت را بررسی کنید و بعد با
                اطمینان تصمیم بگیرید.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-foreground/65">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-2">
                  <BadgeCheck size={15} className="text-primary" />
                  پروفایل‌های قابل بررسی
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-2">
                  <Sparkles size={14} className="text-amber-600" />
                  فیلتر بر اساس امتیاز و تخصص
                </span>
              </div>
            </div>
            <Link
              href="/request"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ثبت درخواست خدمت
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
      <Container className="pt-8 sm:pt-10">
        <SpecialistsDirectory
          specialists={specialists}
          specialistsTotal={specialistsTotal}
          categories={categories}
          initialLoadFailed={specialistsLoadFailed}
          categoriesLoadFailed={categoriesLoadFailed}
        />
      </Container>
    </main>
  );
}
