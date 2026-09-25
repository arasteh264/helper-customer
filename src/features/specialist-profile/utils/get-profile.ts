import { directorySpecialists } from "@/src/features/catalog/api/mock-data";
import { fullProfiles } from "../api/mock-data";
import type { SpecialistProfile } from "../types/specialist-profile.types";

/**
 * پروفایل کامل متخصص را برمی‌گرداند: اگر داده‌ی کامل داشته باشیم از آن استفاده می‌شود،
 * وگرنه یک نسخه‌ی معقول از اطلاعات خلاصه‌ی دایرکتوری ساخته می‌شود تا صفحه هیچ‌وقت خالی نماند.
 */
export function getSpecialistProfile(id: string): SpecialistProfile | null {
  const summary = directorySpecialists.find((s) => s.id === id);
  if (!summary) return null;

  const full = fullProfiles[id];

  if (full) {
    return {
      id: summary.id,
      name: summary.name,
      field: summary.field,
      city: summary.city,
      rating: summary.rating,
      reviewsCount: summary.reviews,
      startingPrice: summary.startingPrice,
      verified: summary.verified,
      ...full,
    };
  }

  // نسخه‌ی خلاصه: بدون بیوگرافی و نمونه‌کار واقعی، ولی همچنان قابل نمایش
  return {
    id: summary.id,
    name: summary.name,
    field: summary.field,
    city: summary.city,
    rating: summary.rating,
    reviewsCount: summary.reviews,
    startingPrice: summary.startingPrice,
    verified: summary.verified,
    headline: summary.field,
    avatar: summary.image,
    completedJobs: summary.jobs,
    responseRate: 85,
    experienceYears: 3,
    memberSince: "2025-01-01T00:00:00+03:30",
    bio: `${summary.name} در حوزه‌ی «${summary.field}» در ${summary.city} فعالیت می‌کند. این متخصص هنوز معرفی کامل ننوشته است.`,
    skills: [summary.field],
    serviceAreas: [summary.city],
    portfolioTints: [],
    availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
    reviews: [],
    hasFullProfile: false,
  };
}

export function listProfileIds(): string[] {
  return directorySpecialists.map((s) => s.id);
}