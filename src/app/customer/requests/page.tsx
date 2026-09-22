import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requests } from "@/src/features/customer/api/mock-data";
import { RequestsList } from "@/src/features/customer/components/requests-list";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "درخواست‌های من | پنل مشتری" };

export default function CustomerRequestsPage() {
  // TODO: درخواست‌های مشتری را از API / دیتابیس بگیرید
  return (
    <>
      <PageHeader
        title="درخواست‌های من"
        description="همه‌ی درخواست‌هایی که تاکنون ثبت کرده‌اید."
        action={
          <Link
            href="/request"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus size={17} />
            درخواست جدید
          </Link>
        }
      />
      <RequestsList requests={requests} />
    </>
  );
}