import type { Metadata } from "next";

import { customer, walletPayments } from "@/src/features/customer/api/mock-data";
import { WalletBalanceCard } from "@/src/features/customer/components/wallet-balance-card";
import { WalletPaymentsTable } from "@/src/features/customer/components/wallet-payments-table";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "کیف پول | پنل مشتری" };

export default function CustomerWalletPage() {
  // TODO: موجودی و تراکنش‌ها را از API / دیتابیس بگیرید
  return (
    <div className="space-y-6">
      <PageHeader title="کیف پول" description="موجودی و تراکنش‌های کیف پول خود را مدیریت کنید." />
      <WalletBalanceCard balance={customer.walletBalance} />
      <WalletPaymentsTable payments={walletPayments} />
    </div>
  );
}