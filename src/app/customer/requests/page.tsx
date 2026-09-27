import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";

import { requestApi } from "@/src/features/request/api/request.api";
import { RequestsList } from "@/src/features/customer/components/requests-list";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "درخواست‌های من | پنل مشتری" };

export default async function CustomerRequestsPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fcustomer%2Frequests");
  }
  const requests = await requestApi.getMyRequests(session.accessToken);

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
