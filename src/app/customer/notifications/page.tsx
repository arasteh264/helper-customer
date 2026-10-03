import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { NotificationCenter } from "@/src/features/notifications/components/notification-center";

export const metadata: Metadata = { title: "اعلان‌ها | پنل مشتری" };

export default async function CustomerNotificationsPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  return (
    <div className="space-y-6">
      <PageHeader
        title="اعلان‌ها"
        description="پیام‌ها و تغییرات مربوط به درخواست‌ها و حساب‌تان را دنبال کنید."
      />
      <NotificationCenter role="CUSTOMER" accessToken={session.accessToken} />
    </div>
  );
}
