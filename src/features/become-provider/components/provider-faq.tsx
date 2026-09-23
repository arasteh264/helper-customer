import { ChevronDown } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { providerFaqs } from "../api/mock-data";

export function ProviderFaq() {
  return (
    <section className="bg-foreground/[0.03] py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading align="center" eyebrow="سؤالات متداول" title="هر چیزی که باید بدانید" />

        <div className="mt-8 space-y-3">
          {providerFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-foreground/10 bg-card px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-7 text-foreground/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}