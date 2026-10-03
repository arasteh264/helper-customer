import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { NotificationCenter } from "@/src/features/notifications/components/notification-center";

export const metadata: Metadata = { title: "اعلان‌ها | پنل ارائه‌دهنده" };

export default async function ProviderNotificationsPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  return (
    <div className="space-y-6">
      <PageHeader
        title="اعلان‌ها"
        description="پیام‌های مشتری، درخواست‌های کاری و تغییرات درآمدتان را دنبال کنید."
      />
      <NotificationCenter role="PROVIDER" accessToken={session.accessToken} />
    </div>
  );
}
