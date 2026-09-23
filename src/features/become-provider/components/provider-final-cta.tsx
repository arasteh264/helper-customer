import { ArrowLeft } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ButtonLink } from "@/src/components/shared/button-link";

export function ProviderFinalCta() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover px-6 py-12 text-center text-primary-foreground sm:px-10 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative text-2xl font-bold sm:text-3xl">آماده‌اید شروع کنید؟</h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-primary-foreground/85 sm:text-base">
            ثبت‌نام رایگان است و فقط چند دقیقه طول می‌کشد.
          </p>
          <ButtonLink href="/register?role=specialist" variant="light" size="lg" className="relative mt-7">
            شروع ثبت‌نام رایگان
            <ArrowLeft size={18} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}