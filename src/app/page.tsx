import type { Metadata } from "next";

import { HeroSection } from "@/src/features/home/components/hero-section";
import { CategoriesSection } from "@/src/features/home/components/categories-section";
import { HowItWorksSection } from "@/src/features/home/components/how-it-works-section";
import { SpecialistsSection } from "@/src/features/home/components/specialists-section";
import { TestimonialsSection } from "@/src/features/home/components/testimonials-section";
import { WhyHelperSection } from "@/src/features/home/components/why-helper-section";
import { CtaSection } from "@/src/features/home/components/cta-section";

export const metadata: Metadata = {
  title: "هلپر | پیدا کردن متخصص برای هر کاری",
  description:
    "متخصصان تأییدشده را در هر زمینه‌ای پیدا کنید، امتیاز و قیمت‌ها را مقایسه کنید و در چند دقیقه درخواست خود را ثبت کنید.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
      <SpecialistsSection />
      <TestimonialsSection />
      <WhyHelperSection />
      <CtaSection />
    </main>
  );
}