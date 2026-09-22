"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/src/components/shared/modal";
import { Switch } from "@/src/components/shared/switch";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { addressSchema, type AddressValues } from "../schemas/address.schema";
import type { Address, AddressType } from "../types/customer.types";
import { toEnglishDigits } from "@/src/utils/format";

const TYPES: { id: AddressType; label: string }[] = [
  { id: "home", label: "منزل" },
  { id: "work", label: "محل کار" },
  { id: "other", label: "سایر" },
];

const DEFAULTS: AddressValues = {
  title: "",
  type: "home",
  receiverName: "",
  receiverPhone: "",
  city: "",
  fullAddress: "",
  plaque: "",
  unit: "",
  postalCode: "",
  isDefault: false,
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddressValues) => Promise<unknown> | unknown;
  initial?: Address;
  isPending?: boolean;
}

export function AddressFormDialog({ open, onClose, onSubmit, initial, isPending }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULTS,
  });

  // هر بار که دیالوگ باز می‌شود، فرم را با مقدار درست پر کن
  useEffect(() => {
    if (open) reset(initial ?? DEFAULTS);
  }, [open, initial, reset]);

  const type = watch("type");

  const submit = async (values: AddressValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "ویرایش آدرس" : "افزودن آدرس جدید"}
      size="lg"
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addr-title">عنوان آدرس</Label>
            <Input
              id="addr-title"
              placeholder="مثلاً: منزل"
              error={!!errors.title}
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-type">نوع آدرس</Label>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setValue("type", t.id, { shouldDirty: true })}
                  className={[
                    "h-10 flex-1 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    type === t.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-foreground/15 text-foreground/60 hover:border-primary/40",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-receiverName">نام تحویل‌گیرنده</Label>
            <Input
              id="addr-receiverName"
              error={!!errors.receiverName}
              {...register("receiverName")}
            />
            {errors.receiverName && (
              <p className="text-xs text-destructive">{errors.receiverName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-receiverPhone">شماره موبایل</Label>
            <Input
              id="addr-receiverPhone"
              dir="ltr"
              inputMode="numeric"
              maxLength={11}
              className="text-start"
              error={!!errors.receiverPhone}
              {...register("receiverPhone", { setValueAs: toEnglishDigits })}
            />
            {errors.receiverPhone && (
              <p className="text-xs text-destructive">{errors.receiverPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-city">شهر</Label>
            <Input id="addr-city" error={!!errors.city} {...register("city")} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-postalCode">کد پستی</Label>
            <Input
              id="addr-postalCode"
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              className="text-start"
              error={!!errors.postalCode}
              {...register("postalCode", { setValueAs: toEnglishDigits })}
            />
            {errors.postalCode && (
              <p className="text-xs text-destructive">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="addr-fullAddress">آدرس کامل</Label>
            <textarea
              id="addr-fullAddress"
              rows={2}
              placeholder="خیابان، کوچه، ساختمان…"
              aria-invalid={!!errors.fullAddress}
              className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              {...register("fullAddress")}
            />
            {errors.fullAddress && (
              <p className="text-xs text-destructive">{errors.fullAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-plaque">پلاک</Label>
            <Input id="addr-plaque" dir="ltr" className="text-start" error={!!errors.plaque} {...register("plaque")} />
            {errors.plaque && <p className="text-xs text-destructive">{errors.plaque.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-unit">واحد (اختیاری)</Label>
            <Input id="addr-unit" dir="ltr" className="text-start" {...register("unit")} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3">
          <Label htmlFor="addr-isDefault" className="!mb-0">
            تنظیم به‌عنوان آدرس پیش‌فرض
          </Label>
          <Switch
            checked={watch("isDefault")}
            onChange={(v) => setValue("isDefault", v, { shouldDirty: true })}
            label="آدرس پیش‌فرض"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {initial ? "ذخیره‌ی تغییرات" : "افزودن آدرس"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}