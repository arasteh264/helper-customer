import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { features } from "../api/data";

export function WhyHelperSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />

      <Container className="relative grid gap-10 lg:grid-cols-3 lg:gap-14">
        <SectionHeading
          tone="inverted"
          eyebrow="چرا هلپر؟"
          title="چرا مشتریان به هلپر اعتماد دارند؟"
          description="از انتخاب متخصص تا پرداخت و پشتیبانی، همه‌چیز برای آرامش شما طراحی شده است."
          className="lg:col-span-1"
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/65">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}