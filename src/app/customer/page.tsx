import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ListChecks, MapPin, Star, Wallet } from "lucide-react";

import { customerApi } from "@/src/features/customer/api/customer.api";
import { addresses, requests } from "@/src/features/customer/api/mock-data";
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

  // TODO: وقتی /customer/requests و /customer/addresses آماده شد، این دو را با customerApi جایگزین کن
  const customer = await customerApi.getProfile(session.accessToken);

  const pendingActions = getPendingActions(requests);
  const activeCount = requests.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled",
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileSummaryCard customer={customer} />

      <PendingActionsList actions={pendingActions} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={ListChecks}
          label="درخواست‌های فعال"
          value={formatNumber(activeCount)}
        />
        <StatCard
          icon={Star}
          label="کارهای تکمیل‌شده"
          value={formatNumber(completedCount)}
        />
        <StatCard
          icon={Wallet}
          label="موجودی کیف پول"
          value={formatMoney(customer.walletBalance ?? 0)}
        />
        <StatCard
          icon={MapPin}
          label="آدرس‌های ثبت‌شده"
          value={formatNumber(addresses.length)}
        />
      </div>

      <ActiveRequestsCard requests={requests} />
    </div>
  );
}
