import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { ServicesExplorer } from "@/src/features/catalog/components/services-explorer";

export const metadata: Metadata = {
  title: "دسته‌بندی خدمات | هلپر",
  description: "همه‌ی دسته‌بندی‌های خدمات هلپر را ببینید و متخصص موردنظرتان را پیدا کنید.",
};

export default function ServicesPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            همه‌ی دسته‌بندی‌های خدمات
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/60">
            از تعمیرات خانه تا مشاوره‌ی حقوقی، تدریس و طراحی؛ دسته‌ی موردنیازتان را پیدا کنید.
          </p>
        </div>

        <ServicesExplorer />
      </Container>
    </div>
  );
}