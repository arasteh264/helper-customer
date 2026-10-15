import type { Metadata } from "next";
import { HowItWorksSection } from "@/src/features/home/components/how-it-works-section";
import { TrustFaqSection } from "@/src/features/home/components/trust-faq-section";
import { CtaSection } from "@/src/features/home/components/cta-section";

export const metadata: Metadata = {
  title: "نحوه‌ی کار هلپا24 | از ثبت درخواست تا انتخاب متخصص",
  description:
    "مراحل ثبت درخواست، دریافت پیشنهاد متخصصان، مقایسه‌ی قیمت‌ها و پیگیری خدمت در هلپا24 را ببینید.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorksSection />
      <TrustFaqSection />
      <CtaSection />
    </main>
  );
}
