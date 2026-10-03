import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";
import { customerApi } from "@/src/features/customer/api/customer.api";
import { PageHeader } from "@/src/components/shared/page-header";
import { CustomerInfoForm } from "@/src/features/customer/components/profile/customer-info-form";
import { ChangePasswordForm } from "@/src/features/customer/components/profile/change-password-form";
import { DeleteAccountSection } from "@/src/features/customer/components/profile/delete-account-section";
import { NotificationPreferencesPanel } from "@/src/features/notifications/components/notification-preferences-panel";
import { notificationPreferencesApi } from "@/src/features/notifications/api/notification-preferences.api";

export const metadata: Metadata = { title: "پروفایل و تنظیمات | پنل مشتری" };

export default async function CustomerProfilePage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const { accessToken } = session;
  let customer;
  try {
    customer = await customerApi.getProfile(accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?reason=session-expired");
    }
    throw error;
  }
  const notificationPreferences = await notificationPreferencesApi
    .get(accessToken)
    .catch(() => null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="پروفایل و تنظیمات"
        description="اطلاعات حساب، امنیت و اعلان‌های خود را مدیریت کنید."
      />
      <CustomerInfoForm customer={customer} />
      <NotificationPreferencesPanel
        role="CUSTOMER"
        accessToken={accessToken}
        initial={notificationPreferences}
      />
      <ChangePasswordForm />
      <DeleteAccountSection />
    </div>
  );
}
