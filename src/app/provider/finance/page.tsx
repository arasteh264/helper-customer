import type { Metadata } from "next";
import { EarningsChart } from "@/src/features/provider/components/earnings-chart";
import { WalletSummary } from "@/src/features/provider/components/wallet-summary";
import { TransactionsTable } from "@/src/features/provider/components/transactions-table";
import { BankAccountCard } from "@/src/features/provider/components/bank-account-card";
import { finance, transactions } from "@/src/features/provider/types/data";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";


export const metadata: Metadata = { title: "پنل مالی | پنل متخصص" };

export default function ProviderFinancePage() {
  // TODO: داده‌های مالی را از API / دیتابیس بگیرید
  return (
    <div className="space-y-6">
      <PageHeader
        title="پنل مالی"
        description="موجودی، درآمد و برداشت‌های خود را یکجا ببینید."
      />

      <WalletSummary finance={finance} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionCard
            title="درآمد ماهانه"
            description="مبلغ به تومان (م = میلیون)"
            className="h-full"
          >
            <EarningsChart data={finance.monthly} />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <BankAccountCard bank={finance.bank} />
        </div>
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}