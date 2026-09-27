import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { SpecialistsDirectory } from "@/src/features/catalog/components/specialists-directory";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";

export const metadata: Metadata = {
  title: "متخصصان هلپر | جستجو و فیلتر",
  description:
    "متخصصان تأییدشده را بر اساس دسته، شهر و امتیاز فیلتر و مقایسه کنید.",
};

export default async function SpecialistsPage() {
  let specialists: DirectorySpecialist[] = [];
  try {
    const providers = await publicProvidersApi.list();
    specialists = providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      field:
        provider.skills.map((skill) => skill.name).join("، ") || "متخصص خدمات",
      categoryId: provider.skills[0]?.name ?? "سایر",
      city: provider.hasServiceArea
        ? "محدوده فعالیت ثبت‌شده"
        : "محدوده فعالیت ثبت‌نشده",
      rating: provider.rating,
      reviews: 0,
      jobs: 0,
      startingPrice: 0,
      verified: provider.verified,
      image: provider.avatarUrl ?? undefined,
      available: provider.available,
      hasServiceArea: provider.hasServiceArea,
    }));
  } catch {
    specialists = [];
  }

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

        <SpecialistsDirectory specialists={specialists} />
      </Container>
    </div>
  );
}
