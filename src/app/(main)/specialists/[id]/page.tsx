import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSpecialistProfile, listProfileIds } from "@/src/features/specialist-profile/utils/get-profile";

import { directorySpecialists } from "@/src/features/catalog/api/mock-data";
import { Container } from "@/src/components/shared/container";
import { ProfileHeader } from "@/src/features/specialist-profile/components/profile-header";
import { ProfileAbout } from "@/src/features/specialist-profile/components/profile-about";
import { ProfilePortfolio } from "@/src/features/specialist-profile/components/profile-portfolio";
import { ProfileAvailability } from "@/src/features/specialist-profile/components/profile-availability.";
import { ProfileReviews } from "@/src/features/specialist-profile/components/profile-reviews";
import { SimilarSpecialists } from "@/src/features/specialist-profile/components/similar-specialists";
import { BookingPanel } from "@/src/features/specialist-profile/components/booking-panel";

export function generateStaticParams() {
  return listProfileIds().map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const profile = getSpecialistProfile(params.id);
  if (!profile) return { title: "متخصص یافت نشد" };
  return {
    title: `${profile.name} — ${profile.headline}`,
    description: profile.bio,
  };
}

export default function SpecialistProfilePage({ params }: { params: { id: string } }) {
  // TODO: پروفایل را از API / دیتابیس بگیرید
  const profile = getSpecialistProfile(params.id);
  if (!profile) notFound();

  const categoryId = directorySpecialists.find((s) => s.id === profile.id)?.categoryId ?? "";

  return (
    <div className="pb-24 pt-8 sm:pb-12 sm:pt-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          {/* محتوای اصلی */}
          <div className="space-y-6">
            <ProfileHeader profile={profile} />

            {!profile.hasFullProfile && (
              <p className="rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-xs leading-6 text-foreground/55">
                این متخصص هنوز پروفایلش را کامل نکرده است؛ اطلاعات نمایش‌داده‌شده محدود است.
              </p>
            )}

            <ProfileAbout profile={profile} />
            <ProfilePortfolio profile={profile} />
            <ProfileAvailability availableDays={profile.availableDays} />
            <ProfileReviews
              reviews={profile.reviews}
              rating={profile.rating}
              reviewsCount={profile.reviewsCount}
            />

            {categoryId && (
              <SimilarSpecialists categoryId={categoryId} excludeId={profile.id} />
            )}
          </div>

          {/* ستون رزرو */}
          <BookingPanel profile={profile} />
        </div>
      </Container>
    </div>
  );
}