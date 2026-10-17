import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { ReferralsDashboard } from "@/src/features/provider/components/referrals/referrals-dashboard";

export const metadata: Metadata = { title: "دعوت متخصصان | پنل متخصص" };

export default async function ProviderReferralsPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider%2Freferrals");
  }

  return <ReferralsDashboard accessToken={session.accessToken} />;
}
