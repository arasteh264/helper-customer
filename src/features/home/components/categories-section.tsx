import Link from "next/link";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { categories } from "../api/data";

const fa = new Intl.NumberFormat("fa-IR");

export function CategoriesSection() {
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

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map(({ id, label, count, icon: Icon, tint, href }) => (
            <li key={id}>
              <Link
                href={href}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:p-5"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon size={24} />
                </span>

                <div>
                  <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/50">
                    {fa.format(count)}+ متخصص
                  </p>
                </div>

                <ArrowUpLeft
                  size={18}
                  className="absolute left-4 top-4 text-foreground/25 transition-colors group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] px-5 py-4 text-center sm:flex-row sm:text-right">
          <p className="text-sm leading-7 text-foreground/70">
            دسته‌ی موردنظرتان را نمی‌بینید؟ هر کاری بخواهید ثبت کنید تا متخصصش را
            برایتان پیدا کنیم.
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