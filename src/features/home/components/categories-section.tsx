"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpLeft, Loader2 } from "lucide-react";
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
    <section id="services" className="scroll-mt-20 py-16 sm:py-20">
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
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-foreground/55">
            <Loader2 size={16} className="animate-spin" />
            در حال بارگذاری دسته‌بندی‌ها…
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm text-red-600">{error}</p>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map(
              ({ id, label, icon: Icon, imageUrl, tint, href }) => (
                <li key={id}>
                  <Link
                    href={href}
                    className="group relative flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:p-5"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <Icon size={24} />
                      )}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {label}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/50">
                        مشاهده متخصص‌ها
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

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] px-5 py-4 text-center sm:flex-row sm:text-right">
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
