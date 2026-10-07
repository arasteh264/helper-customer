import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/src/lib/api/error";
import { Container } from "@/src/components/shared/container";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { ProfileHeader } from "@/src/features/specialist-profile/components/profile-header";
import { ProfileAbout } from "@/src/features/specialist-profile/components/profile-about";
import { ProfilePortfolio } from "@/src/features/specialist-profile/components/profile-portfolio";
import { BookingPanel } from "@/src/features/specialist-profile/components/booking-panel";
import { ProfileReviews } from "@/src/features/specialist-profile/components/profile-reviews";
import type { SpecialistProfile } from "@/src/features/specialist-profile/types/specialist-profile.types";

export const metadata: Metadata = { title: "پروفایل متخصص | هلپر" };

export default async function SpecialistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let provider;
  try {
    provider = await publicProvidersApi.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const specialtyNames =
    provider.specialties?.map((specialty) => specialty.name) ?? [];
  const skills =
    specialtyNames.length > 0
      ? specialtyNames
      : provider.skills.map((skill) => skill.name);
  const profile: SpecialistProfile = {
    id: provider.id,
    name: provider.name,
    headline: skills[0] ?? "متخصص خدمات",
    field: skills.join("، "),
    city: provider.hasServiceArea
      ? "محدوده‌ی فعالیت ثبت شده"
      : "محدوده مشخص نشده",
    avatar: provider.avatarUrl ?? undefined,
    verified: provider.verified,
    rating: provider.rating,
    reviewsCount: provider.reviewsCount,
    completedJobs: provider.completedJobs,
    responseRate: 0,
    experienceYears: 0,
    memberSince: provider.createdAt,
    startingPrice: 0,
    bio:
      provider.bio ?? "این متخصص هنوز توضیحی درباره‌ی خدمات خود ثبت نکرده است.",
    skills,
    serviceAreas: provider.hasServiceArea
      ? ["موقعیت تقریبی برای پیشنهاد نزدیک‌تر ثبت شده"]
      : [],
    portfolioTints: [],
    portfolioImages: provider.portfolio,
    reviews: provider.reviews,
    hasFullProfile: true,
  };

  return (
    <div className="pb-24 pt-8 sm:pb-12 sm:pt-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <ProfileAbout profile={profile} />
            <ProfileReviews
              reviews={profile.reviews}
              rating={profile.rating}
              reviewsCount={profile.reviewsCount}
            />
            <ProfilePortfolio profile={profile} />
          </div>
          <BookingPanel profile={profile} />
        </div>
      </Container>
    </div>
  );
}
