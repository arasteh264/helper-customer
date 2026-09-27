import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/src/components/shared/container";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { ProfileHeader } from "@/src/features/specialist-profile/components/profile-header";
import { ProfileAbout } from "@/src/features/specialist-profile/components/profile-about";
import { ProfilePortfolio } from "@/src/features/specialist-profile/components/profile-portfolio";
import { ProfileAvailability } from "@/src/features/specialist-profile/components/profile-availability.";
import { BookingPanel } from "@/src/features/specialist-profile/components/booking-panel";
import type { SpecialistProfile } from "@/src/features/specialist-profile/types/specialist-profile.types";

export const metadata: Metadata = { title: "پروفایل متخصص | هلپر" };

const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export default async function SpecialistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let provider;
  try {
    provider = await publicProvidersApi.getById(id);
  } catch {
    notFound();
  }

  const skills = provider.skills.map((skill) => skill.name);
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
    reviewsCount: 0,
    completedJobs: 0,
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
    availableDays: provider.workingHours
      .filter((hour) => hour.isActive)
      .map((hour) => DAYS[hour.dayOfWeek] ?? ""),
    reviews: [],
    hasFullProfile: true,
  };

  return (
    <div className="pb-24 pt-8 sm:pb-12 sm:pt-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <ProfileAbout profile={profile} />
            <ProfilePortfolio profile={profile} />
            <ProfileAvailability workingHours={provider.workingHours} />
          </div>
          <BookingPanel profile={profile} />
        </div>
      </Container>
    </div>
  );
}
