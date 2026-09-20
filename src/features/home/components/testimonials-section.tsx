import { Quote, Star } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { testimonials } from "../api/data";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-foreground/[0.03] py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="نظر مشتریان"
          title="مشتریان ما چه می‌گویند؟"
          description="تجربه‌ی واقعی کسانی که کارشان را با هلپر انجام داده‌اند."
        />

        {/* امتیاز کلی */}
        <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-foreground/10 bg-card px-4 py-2 text-sm">
          <span className="flex items-center gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
            ))}
          </span>
          <span className="font-semibold text-foreground">۴٫۸ از ۵</span>
          <span className="text-foreground/50">بر اساس +۸٬۵۰۰ نظر</span>
        </div>

        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t) => (
            <li
              key={t.name}
              className="relative flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-foreground/10 bg-card p-6 md:w-auto"
            >
              <Quote
                size={36}
                className="absolute left-5 top-5 text-primary/10"
                aria-hidden
              />

              <div
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`امتیاز ${t.rating} از ۵`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < t.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-foreground/20"
                    }
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-8 text-foreground/80 sm:text-base">
                «{t.text}»
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-foreground/5 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {t.city} · {t.service}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}