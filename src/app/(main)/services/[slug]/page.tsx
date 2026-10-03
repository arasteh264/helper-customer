import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { CategoryPage } from "@/src/features/catalog/components/category-page";
import { normalizeSpecialtyGroup } from "@/src/features/catalog/utils/category-mapping";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { CtaSection } from "@/src/features/home/components/cta-section";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";
import { requestApi } from "@/src/features/request/api/request.api";
import type {
  Specialty,
  SpecialtyGroup,
} from "@/src/features/request/types/specialty.types";

type Props = { params: Promise<{ slug: string }> };

async function getGroups(): Promise<SpecialtyGroup[]> {
  try {
    return await requestApi.getSpecialtyGroups();
  } catch {
    return [];
  }
}

async function getGroupBySlug(slug: string) {
  const groups = await getGroups();
  return groups.find((group) => (group.slug ?? group.id) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);
  if (!group) return {};
  const category = normalizeSpecialtyGroup(group);
  return {
    title: `${category.label} | هلپر`,
    description: `خدمات ${category.label} را ببینید، متخصص‌های مرتبط را بررسی کنید و درخواستتان را در هلپر ثبت کنید.`,
  };
}

export default async function CategoryRoute({ params }: Props) {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);
  if (!group) notFound();

  const [specialtiesResult, providersResult] = await Promise.allSettled([
    requestApi.getSpecialtyGroupSpecialties(group.id),
    publicProvidersApi.list(),
  ]);

  const specialties: Specialty[] =
    specialtiesResult.status === "fulfilled" ? specialtiesResult.value : [];
  let specialists: DirectorySpecialist[] = [];
  if (providersResult.status === "fulfilled") {
    specialists = providersResult.value
      .filter((provider) =>
        provider.specialties?.some(
          (specialty) => specialty.groupId === group.id,
        ),
      )
      .map(mapPublicProvider);
  }
  const category = normalizeSpecialtyGroup(group);

  return (
    <>
      <div className="pt-10 sm:pt-14">
        <Container>
          <CategoryPage
            category={category}
            specialties={specialties}
            specialists={specialists}
          />
        </Container>
      </div>

      <CtaSection />
    </>
  );
}
