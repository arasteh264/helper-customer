import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { steps } from "../api/data";

const fa = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-foreground/[0.03] py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="مراحل کار"
          title="هلپر چطور کار می‌کند؟"
          description="فقط در چهار قدم ساده، از ثبت نیاز تا انجام کار."
        />

        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            aria-hidden
            className="absolute inset-x-16 top-6 hidden border-t-2 border-dashed border-primary/20 lg:block"
          />

          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative flex gap-4 sm:flex-col sm:items-center sm:text-center"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-8 ring-background">
                <Icon size={22} />
              </span>

              <div>
                <p className="text-xs font-medium text-primary">
                  {fa.format(index + 1)}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-foreground/60">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}