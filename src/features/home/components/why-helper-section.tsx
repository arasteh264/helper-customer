import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { features } from "../api/data";

export function WhyHelperSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#087c70] py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 -z-10 h-80 w-80 rounded-full bg-[#d99c5c]/20 blur-3xl"
      />
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <SectionHeading
            tone="inverted"
            eyebrow="انتخاب با آگاهی"
            title="قبل از سفارش، جواب سؤال‌های مهم را ببینید"
            description="اطلاعاتی که برای تصمیم‌گیری لازم دارید، در پروفایل و صفحه‌ی درخواست در دسترس است."
          />
          <Link
            href="/terms"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            خواندن قوانین و شرایط خدمات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 transition-colors hover:bg-white/[0.1] sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-white/45">
                  {new Intl.NumberFormat("fa-IR", {
                    minimumIntegerDigits: 2,
                  }).format(index + 1)}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
