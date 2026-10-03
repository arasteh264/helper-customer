import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { SpecialistsDirectory } from "@/src/features/catalog/components/specialists-directory";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import { requestApi } from "@/src/features/request/api/request.api";

export const metadata: Metadata = {
  title: "متخصصان هلپر | جستجو و فیلتر",
  description:
    "متخصصان تأییدشده را بر اساس دسته، شهر و امتیاز فیلتر و مقایسه کنید.",
};

export default async function SpecialistsPage() {
  let specialists: DirectorySpecialist[] = [];
  let categories: { id: string; label: string }[] = [];
  const [providersResult, groupsResult] = await Promise.allSettled([
    publicProvidersApi.list(),
    requestApi.getSpecialtyGroups(),
  ]);

  if (providersResult.status === "fulfilled") {
    specialists = providersResult.value.map(mapPublicProvider);
  }
  if (groupsResult.status === "fulfilled") {
    categories = groupsResult.value.map(({ id, name }) => ({
      id,
      label: name,
    }));
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

        <SpecialistsDirectory
          specialists={specialists}
          categories={categories}
        />
      </Container>
    </div>
  );
}
