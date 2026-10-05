import type { PublicProvider } from "../api/providers.api";
import type { DirectorySpecialist } from "../types/catalog.types";

export function mapPublicProvider(
  provider: PublicProvider,
): DirectorySpecialist {
  const specialties = provider.specialties ?? [];
  const categoryIds = [...new Set(specialties.map(({ groupId }) => groupId))];
  const specialtyNames = [...new Set(specialties.map(({ name }) => name))];
  const field =
    specialtyNames.join("، ") ||
    provider.skills.map(({ name }) => name).join("، ") ||
    "متخصص خدمات";

  return {
    id: provider.id,
    name: provider.name,
    field,
    categoryId: categoryIds[0] ?? "",
    categoryIds,
    city: provider.hasServiceArea
      ? "محدوده فعالیت ثبت‌شده"
      : "محدوده مشخص نشده",
    rating: provider.rating,
    reviews: provider.reviewsCount,
    jobs: provider.completedJobs,
    startingPrice: 0,
    verified: provider.verified,
    image: provider.avatarUrl ?? undefined,
    available: provider.available,
    hasServiceArea: provider.hasServiceArea,
    distanceKm: provider.distanceKm,
  };
}
