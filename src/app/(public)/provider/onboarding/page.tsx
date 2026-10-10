import { ProviderOnboardingForm } from "@/src/features/provider/components/onboarding/provider-onboarding-form";

type ProviderOnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProviderOnboardingPage({
  searchParams,
}: ProviderOnboardingPageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <ProviderOnboardingForm
      token={typeof token === "string" ? token : undefined}
    />
  );
}
