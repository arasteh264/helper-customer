import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";
import { EarningsChart } from "@/src/features/provider/components/Financial/earnings-chart";
import { TransactionsTable } from "@/src/features/provider/components/Financial/transactions-table";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { formatDateTime, formatMoney } from "@/src/utils/format";
import { WalletSummary } from "@/src/features/provider/components/Financial/wallet-summary";
import { BankAccountCard } from "@/src/features/provider/components/Financial/bank-account-card";
import { walletApi } from "@/src/features/provider/api/wallet.api";
import type {
  BankAccount,
  FinanceSummary,
  Transaction,
} from "@/src/features/provider/types/types";

export const metadata: Metadata = { title: "پنل مالی | پنل متخصص" };

export default async function ProviderFinancePage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider%2Ffinance");
  }

  let finance: FinanceSummary;
  let transactions: Transaction[];
  let payouts: Awaited<ReturnType<typeof walletApi.getPayouts>>;
  let bank: BankAccount | null = null;

  try {
    const [summary, transactionResult, payoutResult, bankResult] =
      await Promise.all([
        walletApi.getSummary(session.accessToken),
        walletApi.getTransactions(session.accessToken),
        walletApi.getPayouts(session.accessToken),
        walletApi
          .getBankAccount(session.accessToken)
          .catch((error: unknown) => {
            if (error instanceof ApiError && error.status === 404) return null;
            throw error;
          }),
      ]);

    bank = bankResult
      ? {
          bankName: bankResult.bankName ?? "حساب بانکی",
          holder: bankResult.holderName,
          sheba: bankResult.sheba,
          verified: false,
        }
      : null;
    payouts = payoutResult;
    finance = {
      withdrawable: summary.balance,
      pending: summary.pendingPayouts,
      totalEarned: summary.totalEarned,
      grossEarnings:
        summary.grossIncomeToman ??
        summary.grossEarningsToman ??
        summary.grossIncome ??
        summary.grossEarnings ??
        null,
      netEarnings:
        summary.netIncomeToman ??
        summary.netEarningsToman ??
        summary.netIncome ??
        summary.netEarnings ??
        null,
      commissionAmount:
        summary.commissionToman ??
        summary.totalCommissionToman ??
        summary.commission ??
        summary.commissionAmount ??
        null,
      commissionRate: summary.commissionRate,
      minWithdrawal: summary.minWithdrawal,
      monthly: summary.monthly,
      bank,
    };
    transactions = transactionResult.items.map((transaction) => ({
      id: transaction.id,
      date: transaction.createdAt,
      description: transaction.description ?? "تراکنش مالی",
      type:
        transaction.type === "COMMISSION"
          ? "commission"
          : transaction.type === "PAYOUT_REQUEST"
            ? "withdrawal"
            : transaction.type === "PAYOUT_REFUND"
              ? "refund"
              : transaction.type === "ADJUSTMENT"
                ? transaction.amount >= 0
                  ? "earning"
                  : "refund"
                : "earning",
      amount: transaction.amount,
      status:
        transaction.payoutStatus === "PENDING"
          ? "pending"
          : transaction.payoutStatus === "REJECTED" ||
              transaction.payoutStatus === "CANCELLED"
            ? "failed"
            : "completed",
    }));
  } catch {
    return (
      <div className="space-y-6">
        <PageHeader
          title="پنل مالی"
          description="موجودی، درآمد و برداشت‌های خود را یکجا ببینید."
        />
        <SectionCard title="دریافت اطلاعات انجام نشد">
          <div className="flex flex-col items-start gap-4 text-sm text-foreground/65 sm:flex-row sm:items-center sm:justify-between">
            <p>بارگذاری اطلاعات مالی با مشکل روبه‌رو شد. دوباره تلاش کنید.</p>
            <Link
              href="/provider/finance"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
            >
              تلاش دوباره
            </Link>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="پنل مالی"
        description="موجودی، درآمد و برداشت‌های خود را یکجا ببینید."
      />

      <WalletSummary finance={finance} accessToken={session.accessToken} />

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
          <BankAccountCard bank={bank} />
        </div>
      </div>

      <SectionCard
        title="تاریخچه‌ی برداشت‌ها"
        description="وضعیت درخواست‌های برداشت از پاسخ backend"
      >
        {payouts.length === 0 ? (
          <p className="rounded-xl bg-foreground/[0.03] px-4 py-8 text-center text-sm text-foreground/55">
            درخواست برداشتی ثبت نشده است.
          </p>
        ) : (
          <ul className="divide-y divide-foreground/10">
            {payouts.map((payout) => {
              const state = {
                PENDING: { label: "در انتظار بررسی", tone: "warning" as const },
                PAID: { label: "پرداخت‌شده", tone: "success" as const },
                REJECTED: { label: "ردشده", tone: "danger" as const },
                CANCELLED: { label: "لغوشده", tone: "neutral" as const },
              }[payout.status];

              return (
                <li
                  key={payout.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout.amountToman != null || payout.amount != null
                        ? formatMoney(payout.amountToman ?? payout.amount!)
                        : "مبلغ نامشخص"}
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                      {formatDateTime(payout.createdAt)}
                    </p>
                  </div>
                  <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}
