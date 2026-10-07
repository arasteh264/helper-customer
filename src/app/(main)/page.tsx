import type { Metadata } from "next";

import { HeroSection } from "@/src/features/home/components/hero-section";
import { CategoriesSection } from "@/src/features/home/components/categories-section";
import { HowItWorksSection } from "@/src/features/home/components/how-it-works-section";
import { SpecialistsSection } from "@/src/features/home/components/specialists-section";
import { TestimonialsSection } from "@/src/features/home/components/testimonials-section";
import { WhyHelperSection } from "@/src/features/home/components/why-helper-section";
import { TrustFaqSection } from "@/src/features/home/components/trust-faq-section";
import { CtaSection } from "@/src/features/home/components/cta-section";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { blogServerApi } from "@/src/features/blog/api/blog.server";
import { HomeBlogCarousel } from "@/src/features/home/components/home-blog-carousel";
import type { BlogArticleSummary } from "@/src/features/blog/types/blog.types";

export const metadata: Metadata = {
  title: "هلپر | پیدا کردن متخصص برای هر کاری",
  description:
    "پروفایل متخصصان، تخصص و نظرهای ثبت‌شده را ببینید، قیمت را پیش از پرداخت بررسی کنید و درخواستتان را در هلپر پیگیری کنید.",
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
      <HeroSection providers={providers} />
      <CategoriesSection />
      <HowItWorksSection />
      <SpecialistsSection
        providers={providers}
        loadFailed={providerLoadFailed}
      />
      <TestimonialsSection providers={providers} />
      <HomeBlogCarousel articles={blogArticles} />
      <WhyHelperSection />
      <TrustFaqSection />
      <CtaSection />
    </main>
  );
}