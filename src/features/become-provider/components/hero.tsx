import Link from "next/link";
import { FileText, MapPin, Megaphone, Sparkles } from "lucide-react";
import { Container } from "@/src/components/shared/container";
import { ProviderStartButton } from "./provider-start-button";

export function ProviderHero({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover py-16 text-primary-foreground sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -start-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
          فرصت‌های تازه برای متخصصان خدمات
        </span>

        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.35] tracking-tight sm:text-5xl sm:leading-[1.3]">
          مهارتتان را به فرصت‌های کاری نزدیک‌تر کنید
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/85 sm:text-base">
          در هلپا۲۴ پروفایل حرفه‌ای بسازید، محدوده‌ی فعالیت و زمان مناسب خودتان
          را انتخاب کنید و درخواست‌های مرتبط با تخصصتان را از پنل دنبال کنید.
        </p>

        <ul className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-2 text-start sm:grid-cols-4">
          {[
            { icon: MapPin, label: "کار در محدوده‌ی دلخواه" },
            { icon: Megaphone, label: "معرفی نمونه‌کار با داستان" },
            { icon: FileText, label: "فاکتور مرتب برای مشتری" },
            { icon: Sparkles, label: "مدیریت کارها در یک پنل" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-xs leading-5 text-white/95 sm:text-sm"
            >
              <Icon className="size-4 shrink-0 text-white/80" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ProviderStartButton authenticated={authenticated} />
          <Link
            href="#provider-steps"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-base"
          >
            چطور کار می‌کند؟
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/70">
          شروع همکاری را آنلاین انجام دهید؛ اطلاعات و مدارک شما پیش از فعال‌شدن
          حساب بررسی می‌شود.
        </p>

      </Container>
    </section>
  );
}