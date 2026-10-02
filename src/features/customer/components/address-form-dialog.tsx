"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Navigation } from "lucide-react";

import { Modal } from "@/src/components/shared/modal";
import { Switch } from "@/src/components/shared/switch";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { addressSchema, type AddressValues } from "../schemas/address.schema";
import type { Address, AddressType } from "../types/customer.types";
import { toEnglishDigits } from "@/src/utils/format";

// Leaflet به window نیاز دارد → فقط سمت کلاینت
const AddressMap = dynamic(() => import("../../request/components/addressmap"), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-xl bg-foreground/[0.06]" />,
});

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
  latitude: undefined,
  longitude: undefined,
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
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (open) reset(initial ?? DEFAULTS);
  }, [open, initial, reset]);

  const type = watch("type");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const setCoords = (lat: number, lng: number) => {
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords(coords.latitude, coords.longitude);
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت ممکن نشد؛ نقشه را حرکت دهید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

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

          {/* ---------- نقشه ---------- */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>موقعیت روی نقشه (اختیاری)</Label>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
              >
                <Navigation size={14} />
                {locating ? "در حال دریافت…" : "موقعیت فعلی من"}
              </button>
            </div>
            <p className="text-xs text-foreground/50">
              نقشه را حرکت دهید تا پین روی محل دقیق قرار بگیرد.
            </p>
            {/* با open و key، هر بار دیالوگ باز شود نقشه از نو و با مختصات درست ساخته می‌شود */}
            {open && (
              <AddressMap
                key={initial?.id ?? "new"}
                latitude={latitude}
                longitude={longitude}
                onMove={setCoords}
              />
            )}
            {latitude !== undefined && longitude !== undefined && (
              <p className="text-xs text-foreground/45" dir="ltr">
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </p>
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