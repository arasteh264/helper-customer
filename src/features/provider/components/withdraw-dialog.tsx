"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Landmark, Loader2, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

import { formatMoney, maskSheba, toEnglishDigits } from "../utils/format";
import { BankAccount } from "../types/types";

interface Props {
  open: boolean;
  onClose: () => void;
  withdrawable: number;
  min: number;
  bank: BankAccount;
}

export function WithdrawDialog({ open, onClose, withdrawable, min, bank }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // همگام‌سازی state با <dialog> بومی (فوکوس‌ترپ و Escape را مرورگر انجام می‌دهد)
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) setAmount("");
  }, [open]);

  const value = Number(amount || 0);
  const error =
    amount === ""
      ? null
      : value < min
        ? `حداقل مبلغ برداشت ${formatMoney(min)} است`
        : value > withdrawable
          ? "مبلغ بیشتر از موجودی قابل برداشت است"
          : null;
  const canSubmit = amount !== "" && !error && !submitting;

  const quick = (ratio: number) =>
    setAmount(String(Math.floor((withdrawable * ratio) / 1000) * 1000));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/provider/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      if (!res.ok) throw new Error();
      toast.success("درخواست برداشت ثبت شد");
      onClose();
    } catch {
      toast.error("ثبت درخواست انجام نشد. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // کلیک روی پس‌زمینه‌ی تیره
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="withdraw-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-foreground/10 bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="withdraw-title" className="text-lg font-semibold">
              درخواست برداشت
            </h2>
            <p className="mt-1 text-sm text-foreground/55">
              موجودی قابل برداشت: {formatMoney(withdrawable)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/50 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="withdraw-amount">مبلغ (تومان)</Label>
          <input
            id="withdraw-amount"
            inputMode="numeric"
            dir="ltr"
            autoFocus
            autoComplete="off"
            placeholder="مثلاً 2000000"
            value={amount}
            onChange={(e) => setAmount(toEnglishDigits(e.target.value).replace(/\D/g, ""))}
            aria-invalid={!!error}
            aria-describedby="withdraw-hint"
            className={`h-12 w-full rounded-xl border bg-background px-4 text-start text-base outline-none transition-colors focus:ring-4 ${
              error
                ? "border-destructive/50 focus:ring-destructive/10"
                : "border-foreground/15 focus:border-primary/50 focus:ring-primary/10"
            }`}
          />
          <p
            id="withdraw-hint"
            className={`text-xs ${error ? "text-destructive" : "text-foreground/50"}`}
          >
            {error ?? (value > 0 ? formatMoney(value) : `حداقل ${formatMoney(min)}`)}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: "۲۵٪", ratio: 0.25 },
              { label: "۵۰٪", ratio: 0.5 },
              { label: "همه‌ی موجودی", ratio: 1 },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => quick(q.ratio)}
                className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-foreground/[0.04] p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Landmark size={20} />
          </span>
          <div className="min-w-0 text-sm">
            <p className="font-medium">
              {bank.bankName} · {bank.holder}
            </p>
            <p dir="ltr" className="truncate text-start text-xs text-foreground/55">
              {maskSheba(bank.sheba)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-6 text-foreground/50">
          مبلغ در بازه‌ی ۲۴ ساعت کاری به حساب بالا واریز می‌شود. کارمزد برداشت ندارد.
        </p>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" disabled={!canSubmit} className="flex-1 gap-2">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            ثبت درخواست
          </Button>
        </div>
      </form>
    </dialog>
  );
}