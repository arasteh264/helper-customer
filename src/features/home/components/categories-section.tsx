"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { ICONS } from "@/src/features/provider/lib/icons";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";
import type {
  Specialty,
  SpecialtyGroup,
} from "@/src/features/request/types/specialty.types";
import { fallbackServiceMenuItems } from "@/src/components/layout/header/nav-data";

type HomepageServiceGroup = {
  category: CatalogCategory;
  specialties: Specialty[];
};

function fallbackGroups(): HomepageServiceGroup[] {
  return fallbackServiceMenuItems.map((item) => ({
    category: {
      id: item.href,
      slug: item.href.split("/").at(-1) ?? item.href,
      label: item.label,
      icon: ICONS[item.icon],
      svgKey: "",
      imageUrl: null,
      tint: item.tint,
      href: item.href,
    },
    specialties: [],
  }));
}

function getRequestHref(specialty: Specialty, groupName: string) {
  const params = new URLSearchParams({
    specialtyId: specialty.id,
    specialtyName: specialty.name,
    groupName,
  });
  return `/request?${params.toString()}`;
}

function getSpecialtyImage(specialty: Specialty) {
  if (specialty.icon) return specialty.icon;
  return specialty.slug
    ? `/icons/specialties/${specialty.slug}.svg`
    : undefined;
}

export function CategoriesSection() {
  const [groups, setGroups] = useState<HomepageServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadServiceGroups() {
      try {
        const serviceGroups = await requestApi.getSpecialtyGroups();
        const specialtyResults = await Promise.allSettled(
          serviceGroups.map(async (group: SpecialtyGroup) => ({
            group,
            specialties:
              group.specialties ??
              (await requestApi.getSpecialtyGroupSpecialties(group.id)),
          })),
        );

        const loadedGroups: HomepageServiceGroup[] = [];
        let failedSpecialtyGroups = 0;

        specialtyResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            loadedGroups.push({
              category: normalizeSpecialtyGroup(result.value.group),
              specialties: result.value.specialties,
            });
            return;
          }

          failedSpecialtyGroups += 1;
          console.error(
            `Homepage specialties for group "${serviceGroups[index]?.name ?? index}" could not be loaded`,
            result.reason,
          );
          if (serviceGroups[index]) {
            loadedGroups.push({
              category: normalizeSpecialtyGroup(serviceGroups[index]),
              specialties: [],
            });
          }
        });

        if (!active) return;
        setGroups(loadedGroups);
        setStatusMessage(
          failedSpecialtyGroups
            ? "بعضی زیرخدمت‌ها فعلاً بارگذاری نشدند."
            : null,
        );
      } catch (error: unknown) {
        console.error("Homepage service groups could not be loaded", error);
        if (!active) return;
        setGroups(fallbackGroups());
        setStatusMessage("دسته‌بندی‌ها به‌روز نشدند؛ گروه‌های پرکاربرد را می‌بینید.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadServiceGroups();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="services" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="خدمات بر اساس گروه"
          title="خدمت‌ها را بخش‌بندی‌شده پیدا کن"
          description="از خدمات خانه و بازسازی تا زیبایی و آموزش؛ هر گروه را جدا ببین و مستقیم خدمت موردنظرت را انتخاب کن."
          action={
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              مشاهده همه‌ی خدمات
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          }
        />

        {statusMessage && (
          <p className="mt-4 text-xs text-foreground/55" role="status">
            {statusMessage}
          </p>
        )}

        {loading ? (
          <div
            className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2"
            aria-label="گروه‌های خدمات"
            aria-busy="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-xl bg-foreground/[0.035]"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-x-8 gap-y-9 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-11">
            {groups.map(({ category, specialties }) => {
              const Icon = category.icon;

              return (
                <section
                  key={category.id}
                  aria-labelledby={`service-group-${category.id}`}
                  className="min-w-0 border-b border-foreground/[0.08] pb-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-primary ${category.tint}`}
                    >
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt=""
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon size={23} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        id={`service-group-${category.id}`}
                        className="text-base font-bold text-foreground sm:text-lg"
                      >
                        {category.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-foreground/50">
                        {specialties.length
                          ? `${new Intl.NumberFormat("fa-IR").format(specialties.length)} خدمت`
                          : "مشاهده‌ی خدمات این گروه"}
                      </p>
                    </div>
                    <Link
                      href={category.href}
                      aria-label={`مشاهده‌ی همه‌ی خدمات ${category.label}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ArrowUpLeft size={19} aria-hidden="true" />
                    </Link>
                  </div>

                  {specialties.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-2 gap-2.5">
                      {specialties.slice(0, 2).map((specialty) => {
                        const specialtyImage = getSpecialtyImage(specialty);

                        return (
                          <li key={specialty.id}>
                            <Link
                              href={getRequestHref(specialty, category.label)}
                              className="group flex min-h-[5.5rem] items-center gap-2.5 overflow-hidden rounded-xl border border-foreground/[0.08] bg-card p-2 transition-colors hover:border-primary/30 hover:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <span className="relative flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/60">
                                {specialtyImage ? (
                                  <Image
                                    src={specialtyImage}
                                    alt=""
                                    fill
                                    sizes="68px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <Icon
                                    size={22}
                                    className="text-primary"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                              <span className="line-clamp-2 text-xs font-semibold leading-5 text-foreground/80 group-hover:text-primary sm:text-sm">
                                {specialty.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-foreground/55">
                      برای دیدن خدمات این گروه وارد صفحه‌ی آن شوید.
                    </p>
                  )}
                  <Link
                    href={category.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    همه‌ی خدمات {category.label}
                    <ArrowLeft size={15} aria-hidden="true" />
                  </Link>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/[0.06] px-5 py-4 text-center sm:flex-row sm:text-right">
          <p className="text-sm leading-7 text-foreground/70">
            خدمت موردنظرت را پیدا نکردی؟ درخواستت را با توضیح خودت ثبت کن تا
            متخصص مرتبط پیدایش شود.
          </p>
          <Link
            href="/request"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            ثبت درخواست دلخواه
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
