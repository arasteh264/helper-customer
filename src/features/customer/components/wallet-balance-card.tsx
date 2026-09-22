"use client";

import { useState } from "react";
import { Loader2, Plus, Wallet } from "lucide-react";

import { useWalletTopup } from "../hooks/use-wallet-topup";
import { formatMoney, toEnglishDigits } from "@/src/utils/format";

const QUICK_AMOUNTS = [200000, 500000, 1000000];

export function WalletBalanceCard({ balance }: { balance: number }) {
  const [amount, setAmount] = useState("");
  const { topUp, isPending } = useWalletTopup();

  const value = Number(amount || 0);
  const canSubmit = value >= 10000;

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-6 text-primary-foreground sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -start-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Wallet size={22} />
          </span>
          <div>
            <p className="text-sm text-primary-foreground/80">موجودی کیف پول</p>
            <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {formatMoney(balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm font-medium text-foreground">شارژ کیف پول</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(String(a))}
              className={[
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                amount === String(a)
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-foreground/15 text-foreground/65 hover:border-primary/40",
              ].join(" ")}
            >
              {formatMoney(a)}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            placeholder="مبلغ دلخواه (تومان)"
            value={amount}
            onChange={(e) => setAmount(toEnglishDigits(e.target.value).replace(/\D/g, ""))}
            className="h-12 flex-1 rounded-xl border border-foreground/15 bg-background px-4 text-start text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="button"
            onClick={() => topUp(value)}
            disabled={!canSubmit || isPending}
            className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            شارژ
          </button>
        </div>
      </div>
    </div>
  );
}