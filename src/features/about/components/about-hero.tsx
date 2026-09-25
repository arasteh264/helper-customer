import { Container } from "@/src/components/shared/container";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-primary/[0.08] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-24 top-16 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <Container className="flex flex-col items-center text-center">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          درباره‌ی هلپر
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-[1.35] tracking-tight text-foreground sm:text-5xl sm:leading-[1.3]">
          پیدا کردن متخصص مطمئن، دیگر سخت نیست
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/65 sm:text-base">
          هلپر برای این ساخته شده که پیدا کردن یک متخصص قابل اعتماد، به اندازه‌ی سفارش غذا ساده
          باشد؛ چه دنبال یک لوله‌کش باشید، چه یک وکیل یا یک طراح.
        </p>
      </Container>
    </section>
  );
}