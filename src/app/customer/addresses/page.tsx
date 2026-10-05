import type { Metadata } from "next";

import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";

export const metadata: Metadata = { title: "آدرس‌های من | پنل مشتری" };

export default function CustomerAddressesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="آدرس‌های من"
        description="آدرس‌هایی که برای ثبت درخواست استفاده می‌کنید."
      />
      <SectionCard title="مدیریت آدرس‌ها در دسترس نیست">
        <p className="text-sm leading-7 text-foreground/65">
          API فعلی ذخیره و مدیریت آدرس‌ها را پشتیبانی نمی‌کند. تا زمان آماده‌شدن این قابلیت، آدرس ساختگی نمایش داده نمی‌شود.
        </p>
      </SectionCard>
    </div>
  );
}