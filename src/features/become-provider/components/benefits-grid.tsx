import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { benefits } from "../api/mock-data";

export function BenefitsGrid() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="مزایا"
          title="چرا متخصصان هلپر را انتخاب می‌کنند؟"
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-2xl border border-foreground/10 bg-card p-5 transition-colors hover:border-primary/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-foreground/60">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}