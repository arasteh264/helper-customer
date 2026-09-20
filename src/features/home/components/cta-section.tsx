import { ArrowLeft, Briefcase, Search } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ButtonLink } from "@/src/components/shared/button-link";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-8 text-primary-foreground sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Search size={22} />
          </span>
          <h2 className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">
            دنبال متخصص می‌گردید؟
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-primary-foreground/80 sm:text-base">
            درخواستتان را در کمتر از دو دقیقه ثبت کنید و پیشنهاد متخصصان
            تأییدشده را دریافت کنید.
          </p>
          <ButtonLink
            href="/request"
            variant="light"
            size="lg"
            className="relative mt-8"
          >
            ثبت درخواست رایگان
            <ArrowLeft size={18} />
          </ButtonLink>
        </div>

        {/* متخصص */}
        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-8 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Briefcase size={22} />
          </span>
          <h2 className="mt-6 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            متخصص هستید؟ به هلپر بپیوندید
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-foreground/65 sm:text-base">
            با مشتریان جدید آشنا شوید، برنامه‌ی کاری‌تان را خودتان تنظیم کنید و
            درآمدتان را افزایش دهید.
          </p>
          <ButtonLink
            href="/register?role=specialist"
            size="lg"
            className="mt-8"
          >
            ثبت‌نام به‌عنوان متخصص
            <ArrowLeft size={18} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}