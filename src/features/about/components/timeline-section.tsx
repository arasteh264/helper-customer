import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { timeline } from "../api/moke-data";

export function TimelineSection() {
  return (
    <section className="bg-foreground/[0.03] py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading align="center" eyebrow="مسیر ما" title="از شروع تا امروز" />

        <ol className="relative mt-12 space-y-10 border-e-2 border-foreground/10 ps-6">
          {timeline.map((item) => (
            <li key={item.year} className="relative">
              <span className="absolute -start-[calc(1.5rem+5px)] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
              <p className="text-xs font-semibold text-primary">{item.year}</p>
              <h3 className="mt-1 text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-7 text-foreground/60">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}