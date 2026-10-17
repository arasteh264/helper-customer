"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  if (specialty.slug) params.set("specialtySlug", specialty.slug);
  return `/request?${params.toString()}`;
}

function getSpecialtyImage(specialty: Specialty) {
  if (specialty.icon) return specialty.icon;
  return specialty.slug
    ? `/icons/specialties/${specialty.slug}.svg`
    : undefined;
}

function ServiceGroupCard({
  category,
  specialties,
}: HomepageServiceGroup) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const Icon = category.icon;
  const visibleSpecialties = specialties.slice(0, 3);

  function scroll(direction: -1 | 1) {
    const element = scrollerRef.current;
    if (!element) return;
    const rtl = getComputedStyle(element).direction === "rtl";
    element.scrollBy({
      left: element.clientWidth * 0.82 * direction * (rtl ? -1 : 1),
      behavior: "smooth",
    });
  }

  return (
    <section
      aria-labelledby={`service-group-${category.id}`}
      className="min-w-0 rounded-2xl border border-foreground/[0.08] bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-primary ${category.tint}`}
        >
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon size={20} aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3
            id={`service-group-${category.id}`}
            className="text-sm font-bold text-foreground sm:text-base"
          >
            {category.label}
          </h3>
          <p className="mt-0.5 text-xs text-foreground/50">
            {specialties.length
              ? `${new Intl.NumberFormat("fa-IR").format(specialties.length)} خدمت`
              : "خدمات این گروه"}
          </p>
        </div>
      </div>

      {visibleSpecialties.length > 0 ? (
        <ul
          ref={scrollerRef}
          aria-label={`خدمات پیشنهادی ${category.label}`}
          className="-mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] sm:-mx-5 sm:scroll-px-5 sm:px-5 [&::-webkit-scrollbar]:hidden"
        >
          {visibleSpecialties.map((specialty) => {
            const specialtyImage = getSpecialtyImage(specialty);

            return (
              <li
                key={specialty.id}
                className="w-[82%] shrink-0 snap-start sm:w-[76%]"
              >
                <Link
                  href={getRequestHref(specialty, category.label)}
                  className="group flex min-h-14 items-center gap-2.5 rounded-xl bg-secondary/35 p-2 transition-colors hover:bg-primary/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
                    {specialtyImage ? (
                      <Image
                        src={specialtyImage}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Icon
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 line-clamp-2 text-xs font-semibold leading-5 text-foreground/80 group-hover:text-primary sm:text-sm">
                    {specialty.name}
                  </span>
                  <ChevronLeft
                    size={15}
                    className="shrink-0 text-foreground/35 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl bg-secondary/35 px-3 py-4 text-xs text-foreground/55">
          خدمات این گروه را در صفحه‌ی آن ببینید.
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-foreground/[0.06] pt-3">
        <Link
          href={category.href}
          className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
        >
          مشاهده‌ی همه‌ی {new Intl.NumberFormat("fa-IR").format(specialties.length)} خدمت
        </Link>
        {visibleSpecialties.length > 1 ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={`خدمت قبلی ${category.label}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/10 text-foreground/55 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={`خدمت بعدی ${category.label}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/10 text-foreground/55 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
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
    <section id="services" className="scroll-mt-20 bg-secondary/20 py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="خدمات بر اساس گروه"
          title="خدمتت را پیدا کن"
          description="از خدمات خانه تا خودرو و آموزش."
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
            className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="گروه‌های خدمات"
            aria-busy="true"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-foreground/[0.06] bg-card"
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <ServiceGroupCard key={group.category.id} {...group} />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-between gap-2 rounded-xl border border-primary/15 bg-primary/[0.05] px-4 py-3 text-center sm:flex-row sm:text-right">
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
