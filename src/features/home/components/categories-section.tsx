"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { ICONS } from "@/src/features/provider/lib/icons";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";
import { fallbackServiceMenuItems } from "@/src/components/layout/header/nav-data";

export function CategoriesSection() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const element = scrollerRef.current;
    if (!element) return;

    const isRtl = getComputedStyle(element).direction === "rtl";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollBy({
      left: element.clientWidth * 0.8 * direction * (isRtl ? -1 : 1),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    let active = true;

    requestApi
      .getSpecialtyGroups()
      .then((items) => {
        if (!active) return;
        setCategories(items.map(normalizeSpecialtyGroup));
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        console.error("Homepage service categories could not be loaded", loadError);
        setCategories(
          fallbackServiceMenuItems.map((item) => ({
            id: item.href,
            slug: item.href.split("/").at(-1) ?? item.href,
            label: item.label,
            icon: ICONS[item.icon],
            svgKey: "",
            imageUrl: null,
            tint: item.tint,
            href: item.href,
          })),
        );
        setError("دسته‌بندی‌ها به‌روز نشدند؛ خدمات پرکاربرد را می‌بینید.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="services" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="دسته‌بندی‌ها"
          title="در هر زمینه‌ای، متخصص پیدا کنید"
          description="خدمت موردنظرت را پیدا کن؛ برای دیدن دسته‌های بیشتر اسلاید را جابه‌جا کن."
          action={
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                مشاهده همه‌ی دسته‌ها
                <ArrowLeft size={16} />
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  aria-label="دسته‌بندی‌های قبلی"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  aria-label="دسته‌بندی‌های بعدی"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          }
        />

        {error && (
          <p className="mt-4 text-xs text-foreground/55" role="status">
            {error}
          </p>
        )}

        {loading ? (
          <ul
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-hidden"
            aria-label="دسته‌بندی خدمات"
            aria-busy="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="h-40 w-[78%] shrink-0 animate-pulse snap-start rounded-2xl border border-foreground/[0.06] bg-foreground/[0.035] sm:w-[48%] lg:w-[calc((100%-3rem)/4)]"
              />
            ))}
          </ul>
        ) : (
          <ul
            ref={scrollerRef}
            aria-label="دسته‌بندی خدمات"
            className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map(
              ({ id, label, imageUrl, tint, href, icon: Icon }) => (
                <li
                  key={id}
                  className="w-[78%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-3rem)/4)]"
                >
                  <Link
                    href={href}
                    className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card p-4 shadow-sm shadow-foreground/[0.025] transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:min-h-44 sm:p-5"
                  >
                    {imageUrl ? (
                      <span className="-mx-4 -mt-4 mb-3 block aspect-[16/9] overflow-hidden rounded-t-xl bg-primary/5 sm:-mx-5 sm:-mt-5">
                        <Image
                          src={imageUrl}
                          alt=""
                          width={480}
                          height={270}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </span>
                    ) : (
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-primary transition-transform group-hover:rotate-[-5deg] group-hover:scale-105 ${tint}`}
                      >
                        <Icon size={26} aria-hidden="true" />
                      </span>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {label}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/70" aria-label={`دیدن خدمات ${label}`}>
                        دیدن خدمات {label}
                      </p>
                    </div>

                    <ArrowUpLeft
                      size={18}
                      className="absolute left-4 top-4 text-foreground/25 transition-colors group-hover:text-primary"
                      aria-hidden
                    />
                  </Link>
                </li>
              ),
            )}
          </ul>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/[0.06] px-5 py-4 text-center sm:flex-row sm:text-right">
          <p className="text-sm leading-7 text-foreground/70">
            دسته‌ی موردنظرتان را نمی‌بینید؟ هر کاری بخواهید ثبت کنید تا متخصصش
            را برایتان پیدا کنیم.
          </p>
          <Link
            href="/request"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            ثبت درخواست دلخواه
            <ArrowLeft size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
