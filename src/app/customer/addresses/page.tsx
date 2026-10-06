import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";
import { customerApi } from "@/src/features/customer/api/customer.api";
import { AddressesManager } from "@/src/features/customer/components/addresses-manager";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "آدرس‌های من | پنل مشتری" };

export default async function CustomerAddressesPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  let addresses;
  try {
    addresses = await customerApi.getAddresses(session.accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?reason=session-expired");
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="آدرس‌های من"
        description="آدرس‌هایی که برای ثبت درخواست استفاده می‌کنید."
      />
      <AddressesManager initial={addresses} accessToken={session.accessToken} />
    </div>
  );
}