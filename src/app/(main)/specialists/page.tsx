import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { SpecialistsDirectory } from "@/src/features/catalog/components/specialists-directory";

export const metadata: Metadata = {
  title: "متخصصان هلپر | جستجو و فیلتر",
  description: "متخصصان تأییدشده را بر اساس دسته، شهر و امتیاز فیلتر و مقایسه کنید.",
};

export default function SpecialistsPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            متخصصان هلپر
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            متخصصان تأییدشده را بر اساس دسته، شهر و امتیاز فیلتر کنید.
          </p>
        </div>

        <SpecialistsDirectory />
      </Container>
    </div>
  );
}