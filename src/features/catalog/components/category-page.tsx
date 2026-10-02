import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

import { formatNumber } from "@/src/utils/format";
import { specialists } from "../../home/api/data";
import type { Category } from "../../home/types/types";

import { categoryDetails } from "../api/category-details";
import { RequestForm } from "./request-form";

export function CategoryPage({ category }: { category: Category }) {
  const { label, icon: Icon, tint, count, id } = category;
  const detail = categoryDetails[id];
  const list = specialists.filter((s) => s.categoryId === id);

  return (
    <div>
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-primary"
      >
        <ArrowRight size={16} aria-hidden />
        همه‌ی دسته‌بندی‌ها
      </Link>

      {/* هدر */}
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
          <Icon size={32} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{label}</h1>
          <p className="mt-1 text-sm text-foreground/55">
            {formatNumber(count)}+ متخصص تأییدشده
            {detail && <> · شروع قیمت از {formatNumber(detail.startingPrice)} تومان</>}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* محتوای اصلی */}
        <div className="space-y-12">
          {/* مقاله */}
          <article className="space-y-8">
            <p className="text-base leading-8 text-foreground/75">
              {detail?.intro ??
                `در هلپر می‌توانید متخصصان ${label} را بر اساس امتیاز، قیمت و تجربه مقایسه کنید و درخواست خود را ثبت کنید.`}
            </p>

            {detail?.sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">{s.title}</h2>
                <p className="mt-3 text-sm leading-8 text-foreground/70">{s.body}</p>
              </section>
            ))}
          </article>

          <section>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              متخصصان {label}
            </h2>

            {list.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-sm text-foreground/55">
                هنوز متخصصی در این دسته ثبت نشده است. درخواستتان را ثبت کنید تا به شما اطلاع بدهیم.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {list.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/specialists/${s.id}`}
                      className="block h-full rounded-2xl border border-foreground/10 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-foreground">{s.name}</h3>
                        {s.verified && <BadgeCheck size={16} className="text-primary" aria-label="تأییدشده" />}
                      </div>
                      <p className="mt-1 text-xs text-foreground/55">
                        {s.field} · {s.city}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-foreground/70">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {s.rating} ({formatNumber(s.reviews)} نظر)
                        </span>
                        <span className="text-foreground/50">
                          از {formatNumber(s.startingPrice)} تومان
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {detail && detail.faqs.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">سؤالات متداول</h2>
              <div className="mt-4 space-y-2">
                {detail.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-xl border border-foreground/10 bg-card p-4"
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-foreground">
                      {f.q}
                    </summary>
                    <p className="mt-2 text-sm leading-7 text-foreground/65">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* <aside className="lg:sticky lg:top-24 lg:self-start" id="request">
          <RequestForm categoryId={id} categoryLabel={label} />
        </aside> */}
      </div>
    </div>
  );
}