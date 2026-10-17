import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { AdminReferralsPanel } from "@/src/features/provider/components/referrals/admin-referrals-panel";

export const metadata: Metadata = { title: "مدیریت دعوت متخصصان" };

export default async function AdminReferralsPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fadmin%2Freferrals");
  }
  if (session.user?.role?.toUpperCase() !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <AdminReferralsPanel accessToken={session.accessToken} />
    </main>
  );
}
