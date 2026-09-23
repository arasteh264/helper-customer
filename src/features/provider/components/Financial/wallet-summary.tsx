"use client";

import { useState } from "react";
import { ArrowUpRight, Clock3, Percent, TrendingUp } from "lucide-react";
import { FinanceSummary } from "../../types/types";
import { formatMoney, formatNumber } from "@/src/utils/format";
import { WithdrawDialog } from "./withdraw-dialog";





export function WalletSummary({ finance }: { finance: FinanceSummary }) {
  const [open, setOpen] = useState(false);
  const canWithdraw = finance.withdrawable >= finance.minWithdrawal;

  const mini = [
    { icon: Clock3, label: "در انتظار تسویه", value: formatMoney(finance.pending), hint: "بعد از تأیید مشتری آزاد می‌شود" },
    { icon: TrendingUp, label: "کل درآمد", value: formatMoney(finance.totalEarned), hint: "از ابتدای همکاری" },
    { icon: Percent, label: "کارمزد پلتفرم", value: `${formatNumber(finance.commissionRate)}٪`, hint: "از هر کار کسر می‌شود" },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-6 text-primary-foreground sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -start-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-primary-foreground/80">موجودی قابل برداشت</p>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {formatMoney(finance.withdrawable)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={!canWithdraw}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-primary shadow-lg transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              درخواست برداشت
              <ArrowUpRight size={18} className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>

        <dl className="grid divide-y divide-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
          {mini.map(({ icon: Icon, label, value, hint }) => (
            <div key={label} className="flex items-start gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={19} />
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-foreground/55">{label}</dt>
                <dd className="mt-0.5 text-base font-semibold text-foreground">{value}</dd>
                <p className="mt-0.5 text-[11px] text-foreground/45">{hint}</p>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <WithdrawDialog
        open={open}
        onClose={() => setOpen(false)}
        withdrawable={finance.withdrawable}
        min={finance.minWithdrawal}
        bank={finance.bank}
      />
    </>
  );
}