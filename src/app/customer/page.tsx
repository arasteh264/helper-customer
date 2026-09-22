import type { Metadata } from "next";
import { ListChecks, MapPin, Star, Wallet } from "lucide-react";

import { addresses, customer, requests } from "@/src/features/customer/api/mock-data";

import { ActiveRequestsCard } from "@/src/features/customer/components/active-requests-card";
import { PendingActionsList } from "@/src/features/customer/components/pending-actions-list";
import { ProfileSummaryCard } from "@/src/features/customer/components/profile-summary-card";

import { formatMoney, formatNumber } from "@/src/utils/format";
import { StatCard } from "@/src/components/shared/stat-card";
import { getPendingActions } from "@/src/features/customer/utils/pending-actions";

export const metadata: Metadata = { title: "نمای کلی | پنل مشتری" };

export default function CustomerOverviewPage() {
  // TODO: داده‌ها را از API / دیتابیس بگیرید
  const pendingActions = getPendingActions(requests);
  const activeCount = requests.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled"
  ).length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <ProfileSummaryCard customer={customer} />

      <PendingActionsList actions={pendingActions} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="درخواست‌های فعال" value={formatNumber(activeCount)} />
        <StatCard icon={Star} label="کارهای تکمیل‌شده" value={formatNumber(completedCount)} />
        <StatCard icon={Wallet} label="موجودی کیف پول" value={formatMoney(customer.walletBalance)} />
        <StatCard icon={MapPin} label="آدرس‌های ثبت‌شده" value={formatNumber(addresses.length)} />
      </div>

      <ActiveRequestsCard requests={requests} />
    </div>
  );
}