import { ArrowLeft, Briefcase, Search } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ButtonLink } from "@/src/components/shared/button-link";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/15 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-300/30 blur-2xl"
          />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Search size={22} />
          </span>
          <h2 className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">
            دنبال متخصص می‌گردید؟
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 opacity-80 sm:text-base">
            درخواست را ثبت کنید، پیشنهادهای موجود را ببینید و پیش از پرداخت
            مبلغ و اطلاعات متخصص را بررسی کنید.
          </p>
          <ButtonLink
            href="/request"
            variant="light"
            size="lg"
            className="relative mt-8 border-0 bg-white text-primary hover:bg-white/90"
          >
            ثبت درخواست
            <ArrowLeft size={18} />
          </ButtonLink>
        </div>

        {/* متخصص */}
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-secondary/70 p-8 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Briefcase size={22} />
          </span>
          <h2 className="mt-6 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            متخصص هستید؟ به هلپر بپیوندید
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-foreground/65 sm:text-base">
            پروفایل تخصصی بسازید، درخواست‌های متناسب را ببینید و قیمت پیشنهادی
            خود را برای مشتری ثبت کنید.
          </p>
          <ButtonLink
            href="/become-provider"
            size="lg"
            className="mt-8 bg-amber-300 text-slate-950 hover:bg-amber-200"
          >
            همکاری با هلپر
            <ArrowLeft size={18} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}