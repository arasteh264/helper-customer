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
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

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
    <main className="min-h-screen pb-28 sm:pb-16">
      <div className="border-b border-foreground/[0.06] bg-gradient-to-b from-primary/[0.045] to-transparent">
        <Container className="py-5 sm:py-7">
          <nav
            aria-label="مسیر صفحه"
            className="flex flex-wrap items-center gap-2 text-xs text-foreground/50"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              <Home size={13} aria-hidden="true" />
              خانه
            </Link>
            <ChevronLeft size={14} aria-hidden="true" />
            <Link href="/specialists" className="transition-colors hover:text-primary">
              متخصصان
            </Link>
            <ChevronLeft size={14} aria-hidden="true" />
            <span className="font-medium text-foreground/75">{profile.name}</span>
          </nav>
        </Container>
      </div>
      <Container className="pt-5 sm:pt-7">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-7">
          <div className="min-w-0 space-y-5 sm:space-y-6">
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
    </main>
  );
}
