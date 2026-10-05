"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";

export function CategoriesSection() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    requestApi
      .getSpecialtyGroups()
      .then((items) => {
        if (!active) return;
        setCategories(items.map(normalizeSpecialtyGroup));
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("دریافت دسته‌بندی‌ها انجام نشد.");
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
          description="از تعمیرات خانه تا مشاوره‌ی حقوقی و طراحی؛ هر کاری دارید، متخصصش اینجاست."
          action={
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              مشاهده همه‌ی دسته‌ها
              <ArrowLeft size={16} />
            </Link>
          }
        />

        {loading ? (
          <ul
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            aria-label="دسته‌بندی خدمات"
            aria-busy="true"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <li
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-foreground/[0.06] bg-foreground/[0.035] sm:h-40"
              />
            ))}
          </ul>
        ) : error ? (
          <p className="mt-10 text-center text-sm text-red-600">{error}</p>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map(
              ({ id, label, icon: Icon, imageUrl, tint, href }) => (
                <li key={id}>
                  <Link
                    href={href}
                    className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card p-4 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:min-h-44 sm:p-5"
                  >
                    {imageUrl ? (
                      <span className="-mx-4 -mt-4 mb-3 block aspect-[16/9] overflow-hidden rounded-t-xl bg-primary/5 sm:-mx-5 sm:-mt-5">
                        <Image
                          src={imageUrl}
                          alt=""
                          width={480}
                          height={270}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </span>
                    ) : (
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-[-5deg] group-hover:scale-105 ${tint}`}
                      >
                        <Icon size={24} />
                      </span>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {label}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/50">
                        دیدن خدمات این دسته
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

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-[#f3f0e7] px-5 py-4 text-center dark:bg-primary/[0.07] sm:flex-row sm:text-right">
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
