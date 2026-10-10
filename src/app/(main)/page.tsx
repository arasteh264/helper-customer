import type { Metadata } from "next";

import { HeroSection } from "@/src/features/home/components/hero-section";
import { CategoriesSection } from "@/src/features/home/components/categories-section";
import { HowItWorksSection } from "@/src/features/home/components/how-it-works-section";
import { SpecialistsSection } from "@/src/features/home/components/specialists-section";
import { TestimonialsSection } from "@/src/features/home/components/testimonials-section";
import { TrustFaqSection } from "@/src/features/home/components/trust-faq-section";
import { CtaSection } from "@/src/features/home/components/cta-section";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { blogServerApi } from "@/src/features/blog/api/blog.server";
import { HomeBlogCarousel } from "@/src/features/home/components/home-blog-carousel";
import { HomeMaintenanceCarousel } from "@/src/features/home/components/home-maintenance-carousel";
import type { BlogArticleSummary } from "@/src/features/blog/types/blog.types";

export const metadata: Metadata = {
  title: "هلپر | خدمات خانه، تعمیرات و متخصصان قابل‌مقایسه",
  description:
    "برای تعمیرات و خدمات خانه متخصص پیدا کنید، پیشنهاد قیمت و پروفایل‌ها را مقایسه کنید و راهنماهای کاربردی نگهداری خانه را در هلپر بخوانید.",
  keywords: [
    "خدمات منزل",
    "تعمیرات خانه",
    "پیدا کردن متخصص",
    "مقایسه قیمت متخصصان",
    "نگهداری خانه",
    "هلپر",
  ],
};

export default async function HomePage() {
  let providers: Awaited<
    ReturnType<typeof publicProvidersApi.listPage>
  >["items"] = [];
  let providerLoadFailed = false;

  try {
    providers = (await publicProvidersApi.listPage(1, 16)).items;
  } catch (error) {
    providerLoadFailed = true;
    console.error("Homepage provider data could not be loaded", error);
  }

  let blogArticles: BlogArticleSummary[] = [];
  try {
    blogArticles = (await blogServerApi.list({ page: 1, pageSize: 6 })).items;
  } catch (error) {
    console.error("Homepage blog articles could not be loaded", error);
  }

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <HomeMaintenanceCarousel />
      <SpecialistsSection
        providers={providers}
        loadFailed={providerLoadFailed}
      />
      <HowItWorksSection />
      <TestimonialsSection providers={providers} />
      <HomeBlogCarousel articles={blogArticles} />
      <TrustFaqSection />
      <CtaSection />
    </main>
  );
}