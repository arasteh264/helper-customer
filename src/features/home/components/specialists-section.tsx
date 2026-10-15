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
  const groups = new Map<
    string,
    { name: string; specialists: DirectorySpecialist[] }
  >();

  for (const provider of providers) {
    const specialist = mapPublicProvider(provider);
    const providerGroups = new Map(
      (provider.specialties ?? []).map(({ groupId, groupName }) => [
        groupId,
        groupName,
      ]),
    );

    if (providerGroups.size === 0) {
      providerGroups.set("recommended", "متخصصان پیشنهادی");
    }

    for (const [groupId, groupName] of providerGroups) {
      const group = groups.get(groupId) ?? {
        name: groupName,
        specialists: [],
      };
      group.specialists.push(specialist);
      groups.set(groupId, group);
    }
  }

  const specialistGroups = [...groups.entries()].sort(
    ([, first], [, second]) =>
      second.specialists.length - first.specialists.length,
  );

  return (
    <section
      id="specialists"
      className="scroll-mt-20 overflow-hidden bg-gradient-to-b from-primary/[0.055] via-background to-secondary/35 py-12 sm:py-20"
    >
      <Container>
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <BadgeCheck size={15} className="ml-1.5" aria-hidden="true" />
              متخصصان آماده‌ی خدمت
            </span>
            <h2 className="mt-3 text-[1.65rem] font-black leading-9 text-foreground sm:text-3xl">
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

        {specialistGroups.length > 0 ? (
          <div className="space-y-5 sm:space-y-7">
            {specialistGroups.map(([groupId, group]) => (
              <section
                key={groupId}
                aria-labelledby={`specialist-group-${groupId}`}
                className="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-card/80 py-4 shadow-sm shadow-foreground/[0.025] sm:rounded-[1.75rem] sm:py-6"
              >
                <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:px-6">
                  <div className="min-w-0">
                    <h3
                      id={`specialist-group-${groupId}`}
                      className="truncate text-base font-bold text-foreground sm:text-lg"
                    >
                      {group.name}
                    </h3>
                    <p className="mt-1 text-xs text-foreground/55">
                      پروفایل‌ها را ببینید و مقایسه کنید
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
                    <BadgeCheck size={14} aria-hidden="true" />
                    {new Intl.NumberFormat("fa-IR").format(
                      group.specialists.length,
                    )}{" "}
                    متخصص
                  </span>
                </div>
                <SpecialistsCarousel
                  specialists={group.specialists}
                  label={`متخصصان ${group.name}`}
                />
              </section>
            ))}
          </div>
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
