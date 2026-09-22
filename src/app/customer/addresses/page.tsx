import type { Metadata } from "next";

import { addresses } from "@/src/features/customer/api/mock-data";
import { AddressesManager } from "@/src/features/customer/components/addresses-manager";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "آدرس‌های من | پنل مشتری" };

export default function CustomerAddressesPage() {
  // TODO: آدرس‌ها را از API / دیتابیس بگیرید
  return (
    <>
      <PageHeader title="آدرس‌های من" description="آدرس‌هایی که برای ثبت درخواست استفاده می‌کنید." />
      <AddressesManager initial={addresses} />
    </>
  );
}