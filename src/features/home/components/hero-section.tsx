import { ArrowLeft, BadgeCheck, CheckCircle2, Star } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ButtonLink } from "@/src/components/shared/button-link";
import { HeroSearch } from "./hero-search";

const previewResults = [
  { initial: "ع", name: "علی رضایی", field: "لوله‌کش ساختمان", rating: "۴٫۹", status: "امروز آماده" },
  { initial: "م", name: "مریم حسینی", field: "وکیل پایه یک دادگستری", rating: "۴٫۹", status: "فردا" },
  { initial: "ن", name: "نیما صادقی", field: "طراح UI/UX", rating: "۴٫۸", status: "همین هفته" },
];

const avatarInitials = ["ع", "م", "ن", "پ"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* پس‌زمینه‌ی تزئینی */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-primary/[0.08] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* ───── متن ───── */}
        <div className="flex flex-col items-start">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            متخصص برای بیش از ۵۰ حوزه‌ی کاری
          </span>

          <h1 className="text-3xl font-bold leading-[1.35] tracking-tight text-foreground sm:text-5xl sm:leading-[1.3] lg:text-6xl lg:leading-[1.25]">
            متخصص مناسب را{" "}
            <span className="text-primary">برای هر کاری</span> پیدا کنید
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-foreground/65 sm:text-lg">
            از تعمیرات خانه تا مشاوره‌ی حقوقی، تدریس و طراحی؛ متخصصان تأییدشده‌ی
            نزدیک خودتان را پیدا کنید، امتیاز و قیمت‌ها را مقایسه کنید و در چند
            دقیقه درخواست‌تان را ثبت کنید.
          </p>

          <div className="mt-8 w-full">
            <HeroSearch />
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/request" size="lg" className="w-full sm:w-auto">
              درخواست خدمات
              <ArrowLeft size={18} />
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              مشاهده خدمات
            </ButtonLink>
          </div>

          {/* اعتماد اجتماعی */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex">
              {avatarInitials.map((ch, i) => (
                <span
                  key={ch}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-background",
                    i > 0 ? "-mr-2" : "",
                  ].join(" ")}
                >
                  {ch}
                </span>
              ))}
            </div>
            <div className="text-sm leading-6">
              <p className="flex items-center gap-1 font-semibold text-foreground">
                ۴٫۸
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span className="font-normal text-foreground/50">
                  از ۵ · بیش از ۱۲٬۰۰۰ کاربر فعال
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ───── پیش‌نمایش محصول ───── */}
        <div className="relative mx-auto w-full max-w-md pb-6 pt-4 lg:max-w-lg">
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-0 top-8 -z-10 rounded-[2rem] bg-primary/15 blur-2xl"
          />

          <div className="rounded-3xl border border-foreground/10 bg-card p-4 shadow-2xl shadow-foreground/[0.08] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                متخصصان پیشنهادی برای شما
              </p>
              <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                آنلاین
              </span>
            </div>

            <ul className="space-y-3">
              {previewResults.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.07] bg-background p-3 transition-colors hover:border-primary/30"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                    {item.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
                      {item.name}
                      <BadgeCheck size={15} className="shrink-0 text-primary" />
                    </p>
                    <p className="truncate text-xs text-foreground/55">
                      {item.field}
                    </p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="flex items-center justify-end gap-1 text-xs font-medium text-foreground">
                      {item.rating}
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                    </p>
                    <p className="text-[11px] text-green-600">{item.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* نشان‌های شناور */}
          <div className="absolute -bottom-1 left-3 flex items-center gap-2 rounded-xl border border-foreground/10 bg-card px-3 py-2 text-xs font-medium text-foreground shadow-xl shadow-foreground/10 sm:left-0">
            <CheckCircle2 size={16} className="text-green-600" />
            رزرو شما تأیید شد
          </div>
        </div>
      </Container>
    </section>
  );
}