import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { BenefitsGrid } from "@/src/features/become-provider/components/benefits-grid";
import { OnboardingSteps } from "@/src/features/become-provider/components/onboarding-steps";
import { EarningsShowcase } from "@/src/features/become-provider/components/earnings-showcase";
import { ProviderFaq } from "@/src/features/become-provider/components/provider-faq";
import { ProviderFinalCta } from "@/src/features/become-provider/components/provider-final-cta";
import { ProviderHero } from "@/src/features/become-provider/components/hero";

export const metadata: Metadata = {
  title: "همکاری با هلپر به‌عنوان متخصص",
  description: "با تخصص‌تان درآمد کسب کنید. همین امروز پروفایل خود را در هلپر بسازید.",
};

export default async function BecomeProviderPage() {
  const session = await auth();
  const authenticated = Boolean(session?.accessToken);
  if (session?.user?.role?.toUpperCase() === "PROVIDER") {
    redirect("/provider/profile");
  }

  return (
    <main>
      <ProviderHero authenticated={authenticated} />
      <BenefitsGrid />
      <OnboardingSteps />
      <EarningsShowcase />
      <ProviderFaq />
      <ProviderFinalCta authenticated={authenticated} />
    </main>
  );
}