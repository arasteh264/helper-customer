import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { specialists } from "../api/data";
import { SpecialistsCarousel } from "./specialists-carousel";

export function SpecialistsSection() {
  return (
    <section id="specialists" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="متخصصان برتر"
          title="متخصصان مورد اعتماد نزدیک شما"
          description="با چند نفر از بهترین متخصصانی که همین حالا به مشتریانی مثل شما کمک می‌کنند آشنا شوید."
          action={
            <Link
              href="/specialists"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              مشاهده همه‌ی متخصصان
              <ArrowLeft size={16} />
            </Link>
          }
        />

        <div className="mt-8">
          <SpecialistsCarousel specialists={specialists} />
        </div>
      </Container>
    </section>
  );
}