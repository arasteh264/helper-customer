import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { steps } from "../api/data";

const fa = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-secondary/55 py-16 sm:py-24"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="مراحل کار"
          title="از ثبت درخواست تا تأیید نهایی"
          description="در هر مرحله می‌دانید چه چیزی در انتظار شماست و تصمیم بعدی با شماست."
        />

        <ol className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div
            aria-hidden
            className="absolute inset-x-16 top-7 hidden border-t border-dashed border-primary/25 lg:block"
          />

          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative rounded-2xl border border-foreground/[0.07] bg-card p-5 sm:flex-col sm:items-start sm:text-right"
            >
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Icon size={22} />
              </span>

              <div className="mt-5">
                <p className="text-xs font-semibold text-primary">
                  قدم {fa.format(index + 1)}
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