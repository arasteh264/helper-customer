"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, Landmark, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { BankAccount } from "../../types/types";
import { walletApi } from "../../api/wallet.api";
import { maskSheba, toEnglishDigits } from "../../utils/format";

export function BankAccountCard({
  bank,
  accessToken,
}: {
  bank: BankAccount | null;
  accessToken: string;
}) {
  const [savedBank, setSavedBank] = useState(bank);
  const [holderName, setHolderName] = useState(bank?.holder ?? "");
  const [sheba, setSheba] = useState(bank?.sheba ?? "");
  const [bankName, setBankName] = useState(bank?.bankName ?? "");
  const [saving, setSaving] = useState(false);

  const saveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSheba = toEnglishDigits(sheba)
      .replace(/\s+/g, "")
      .toUpperCase();
    if (!holderName.trim() || !/^IR\d{24}$/.test(normalizedSheba)) {
      toast.error("نام صاحب حساب و شبای معتبر را وارد کنید.");
      return;
    }

    setSaving(true);
    try {
      const account = await walletApi.upsertBankAccount(accessToken, {
        holderName: holderName.trim(),
        sheba: normalizedSheba,
        bankName: bankName.trim() || undefined,
      });
      const next = {
        bankName: account.bankName ?? "حساب بانکی",
        holder: account.holderName,
        sheba: account.sheba,
        verified: false,
      };
      setSavedBank(next);
      setHolderName(next.holder);
      setSheba(next.sheba);
      setBankName(account.bankName ?? "");
      toast.success("حساب بانکی ذخیره شد.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ذخیره‌ی حساب بانکی انجام نشد.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="حساب بانکی" description="مقصد واریز برداشت‌های شما">
      {savedBank ? (
        <div className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-background p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Landmark size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {savedBank.bankName ?? "حساب بانکی"}
              </p>
              {savedBank.verified && (
                <StatusBadge tone="success">
                  <BadgeCheck size={13} />
                  تأییدشده
                </StatusBadge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-foreground/55">
              {savedBank.holder}
            </p>
            <p
              dir="ltr"
              className="mt-1 break-all text-start text-xs tracking-wide text-foreground/70"
            >
              {maskSheba(savedBank.sheba)}
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-foreground/[0.03] px-4 py-8 text-center text-sm text-foreground/55">
          هنوز حساب بانکی ثبت نشده است.
        </p>
      )}

      <form
        onSubmit={saveAccount}
        className="mt-5 space-y-4 border-t border-foreground/10 pt-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="payout-holder">نام صاحب حساب</Label>
            <Input
              id="payout-holder"
              autoComplete="name"
              value={holderName}
              onChange={(event) => setHolderName(event.target.value)}
              placeholder="مطابق نام صاحب شبا"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payout-bank">نام بانک (اختیاری)</Label>
            <Input
              id="payout-bank"
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              placeholder="مثلاً ملت"
              maxLength={100}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payout-sheba">شماره شبا</Label>
            <Input
              id="payout-sheba"
              value={sheba}
              persianDigits
              onChange={(event) =>
                setSheba(toEnglishDigits(event.target.value).toUpperCase())
              }
              inputMode="text"
              dir="ltr"
              autoComplete="off"
              maxLength={26}
              placeholder="IR000000000000000000000000"
              className="text-start tracking-wide"
            />
            <p className="text-xs leading-5 text-foreground/50">
              IR و ۲۴ رقم؛ اعتبارسنجی نهایی هنگام ذخیره انجام می‌شود.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-55"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving
            ? "در حال ذخیره"
            : savedBank
              ? "ذخیره‌ی تغییرات حساب"
              : "ثبت حساب بانکی"}
        </button>
      </form>
    </SectionCard>
  );
}
