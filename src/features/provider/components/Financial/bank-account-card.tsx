"use client";

import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { BankAccount } from "../../types/types";
import { walletApi } from "../../api/wallet.api";
import {
  getIranianBankName,
  isValidIranianSheba,
  maskSheba,
  normalizeSheba,
} from "../../utils/format";

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
  const [saving, setSaving] = useState(false);
  const normalizedSheba = normalizeSheba(sheba);
  const completeSheba = /^IR\d{24}$/.test(normalizedSheba);
  const validSheba = isValidIranianSheba(normalizedSheba);
  const detectedBankName = getIranianBankName(normalizedSheba);
  const bankCode = completeSheba
    ? normalizedSheba.slice(4, 7)
    : null;
  const shownBankName =
    detectedBankName ??
    (bankCode ? `بانک با کد ${bankCode}` : savedBank?.bankName) ??
    "کارت بانکی";

  const saveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeSheba(sheba);
    if (!holderName.trim() || !isValidIranianSheba(normalized)) {
      toast.error("نام صاحب حساب و شماره شبای معتبر را وارد کنید.");
      return;
    }

    setSaving(true);
    try {
      const account = await walletApi.upsertBankAccount(accessToken, {
        holderName: holderName.trim(),
        sheba: normalized,
        bankName: getIranianBankName(normalized) ?? undefined,
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
      <div
        className="space-y-4 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4"
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-foreground/55">
              {savedBank ? "حساب مقصد برداشت" : "پیش‌نمایش حساب بانکی"}
            </p>
            <p className="mt-1 font-semibold">{shownBankName}</p>
          </div>
          <p className="text-xs text-foreground/55">
            {detectedBankName
              ? "بانک شناسایی شد"
              : completeSheba && !validSheba
                ? "شماره شبا معتبر نیست"
                : bankCode
                  ? `کد بانک ${bankCode} شناسایی نشد`
                  : normalizedSheba.length > 4
                    ? "کد بانک در فهرست موجود نیست"
                    : "پس از واردکردن شبا، بانک نمایش داده می‌شود"}
          </p>
        </div>

        <div className="grid gap-3 border-t border-foreground/10 pt-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-foreground/55">شماره شبا</p>
            <p dir="ltr" className="mt-1 text-start font-medium tracking-wide">
              {completeSheba
                ? maskSheba(normalizedSheba)
                : "IR•••• •••• •••• •••• ••••"}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/55">صاحب حساب</p>
            <p className="mt-1 truncate font-medium">
              {holderName.trim() || "نام صاحب حساب"}
            </p>
          </div>
        </div>
      </div>

      {savedBank?.verified && (
        <div className="mt-3">
          <StatusBadge tone="success">
            <BadgeCheck size={13} />
            حساب تأییدشده
          </StatusBadge>
        </div>
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payout-sheba">شماره شبا</Label>
            <Input
              id="payout-sheba"
              value={sheba}
              persianDigits
              onChange={(event) => setSheba(event.target.value.toUpperCase())}
              inputMode="text"
              dir="ltr"
              autoComplete="off"
              maxLength={34}
              placeholder="IR یا ۲۴ رقم شبا"
              className="text-start tracking-wide"
            />
            <p className="text-xs leading-5 text-foreground/50">
              می‌توانید IR را وارد کنید یا فقط ۲۴ رقم شبا را بنویسید؛ پیشوند IR
              در صورت نیاز خودکار اضافه می‌شود.
            </p>
            <p className="text-xs leading-5 text-foreground/50">
              نام بانک از کد داخل شبا تشخیص داده می‌شود. تطبیق مالکیت حساب با
              بانک نیازمند سرویس تأیید بانکی است و این فرم به‌تنهایی آن را تأیید
              نمی‌کند.
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
