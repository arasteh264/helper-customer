"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, LockKeyhole, Save } from "lucide-react";

import { SectionCard } from "@/src/components/shared/section-card";
import { Button } from "@/src/components/ui/button";
import { providerApi } from "../../api/provider.api";

export function ProviderAddressEditor({
  initialAddress,
  initialAddressType,
}: {
  initialAddress: string | null;
  initialAddressType: "HOME" | "BUSINESS";
}) {
  const [address, setAddress] = useState(initialAddress ?? "");
  const [addressType, setAddressType] = useState(initialAddressType);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const normalizedAddress = address.trim();
    if (normalizedAddress.length < 5) {
      toast.error("نشانی کامل را وارد کنید (حداقل ۵ نویسه)");
      return;
    }
    setSaving(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) throw new Error("نشست شما منقضی شده است");
      await providerApi.updateProfile(
        {
          providerAddress: normalizedAddress,
          providerAddressType: addressType,
        },
        session.accessToken,
      );
      setAddress(normalizedAddress);
      setDirty(false);
      toast.success("نشانی محرمانه‌ی شما ذخیره شد");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ذخیره‌ی نشانی انجام نشد",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="private-address"
      title="نشانی محرمانه"
      description="برای بررسی‌های امنیتی حساب نگهداری می‌شود و فقط شما و مدیران مجاز هلپر آن را می‌بینید."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="provider-address-type"
            className="block text-sm font-medium text-foreground"
          >
            نوع نشانی
          </label>
          <select
            id="provider-address-type"
            value={addressType}
            onChange={(event) => {
              const nextType = event.currentTarget.value;
              if (nextType === "HOME" || nextType === "BUSINESS") {
                setAddressType(nextType);
                setDirty(true);
              }
            }}
            className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:max-w-xs"
          >
            <option value="HOME">منزل</option>
            <option value="BUSINESS">مغازه یا محل کسب</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="provider-private-address"
            className="block text-sm font-medium text-foreground"
          >
            نشانی کامل
          </label>
          <textarea
            id="provider-private-address"
            rows={3}
            maxLength={500}
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setDirty(true);
            }}
            placeholder="استان، شهر، خیابان، کوچه و پلاک"
            className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-6 outline-none placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 text-xs text-foreground/55">
            <LockKeyhole size={14} />
            این نشانی در پروفایل عمومی و صفحه‌ی مشتری نمایش داده نمی‌شود.
          </p>
          <Button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="gap-2"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            ذخیره نشانی
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
