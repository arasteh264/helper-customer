import Link from "next/link";
import { ArrowLeft, BadgeCheck, MessageSquareText } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";
import type { PublicProvider } from "@/src/features/catalog/api/providers.api";
import { SpecialistsCarousel } from "./specialists-carousel";

export function SpecialistsSection({
  providers,
  loadFailed,
}: {
  providers: PublicProvider[];
  loadFailed: boolean;
}) {
  const specialists: DirectorySpecialist[] = providers
    .slice(0, 8)
    .map(mapPublicProvider);

  return (
    <section
      id="specialists"
      className="scroll-mt-20 overflow-hidden bg-gradient-to-b from-primary/[0.035] to-transparent py-16 sm:py-20"
    >
      <Container>
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <BadgeCheck size={15} className="ml-1.5" aria-hidden="true" />
              متخصصان آماده‌ی خدمت
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-9 text-foreground sm:text-3xl">
              متخصص مناسب را با خیال راحت انتخاب کنید
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/65 sm:text-base">
              پروفایل، حوزه‌ی فعالیت و بازخوردهای ثبت‌شده را ببینید؛ هر وقت
              آماده بودید، درخواستتان را ثبت کنید.
            </p>
          </div>
          <Link
            href="/specialists"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            مشاهده‌ی همه‌ی متخصصان
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        {specialists.length > 0 ? (
          <SpecialistsCarousel specialists={specialists} />
        ) : (
          <div
            className="rounded-3xl border border-foreground/10 bg-card px-6 py-12 text-center shadow-sm sm:py-16"
            role={loadFailed ? "status" : undefined}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareText size={24} aria-hidden="true" />
            </span>
            <p className="mt-4 text-base font-semibold text-foreground">
              {loadFailed
                ? "دریافت فهرست متخصصان فعلاً ممکن نشد."
                : "متخصص آماده‌ی پذیرش در این فهرست پیدا نشد."}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-foreground/60">
              خدمت موردنظرتان را انتخاب کنید یا درخواست ثبت کنید تا متخصصان
              مناسب را پیدا کنیم.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/services"
                className="inline-flex h-10 items-center rounded-xl border border-foreground/15 px-4 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/30 hover:text-primary"
              >
                دیدن خدمات
              </Link>
              <Link
                href="/request"
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                ثبت درخواست
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
