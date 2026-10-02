import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ListChecks, MapPin, Star, Wallet } from "lucide-react";

import { customerApi } from "@/src/features/customer/api/customer.api";
import { ActiveRequestsCard } from "@/src/features/customer/components/active-requests-card";
import { PendingActionsList } from "@/src/features/customer/components/pending-actions-list";
import { ProfileSummaryCard } from "@/src/features/customer/components/profile-summary-card";
import { getPendingActions } from "@/src/features/customer/utils/pending-actions";
import { StatCard } from "@/src/components/shared/stat-card";
import { formatMoney, formatNumber } from "@/src/utils/format";
import { auth } from "@/src/auth";

export const metadata: Metadata = { title: "نمای کلی | پنل مشتری" };

export default async function CustomerOverviewPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const customer = await customerApi.getProfile(session.accessToken);

  const requests = customer.recentActiveRequests ?? [];
  const pendingActions = getPendingActions(requests);

  return (
    <div className="space-y-6">
      <ProfileSummaryCard customer={customer} />

      <PendingActionsList actions={pendingActions} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={ListChecks}
          label="درخواست‌های فعال"
          value={formatNumber(customer.activeRequests ?? 0)}
        />
        <StatCard
          icon={Star}
          label="کارهای تکمیل‌شده"
          value={formatNumber(customer.completedJobs ?? 0)}
        />
        <StatCard
          icon={Wallet}
          label="موجودی کیف پول"
          value={formatMoney(customer.walletBalance ?? 0)}
        />
        <StatCard
          icon={MapPin}
          label="آدرس‌های ثبت‌شده"
          value={formatNumber(customer.addressesCount ?? 0)}
        />
      </div>

      <ActiveRequestsCard requests={requests} />
    </div>
  );
}