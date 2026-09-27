"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Navigation, Check } from "lucide-react";

export function AddressStep({
  value,
  latitude,
  longitude,
  onChange,
}: {
  value: string;
  latitude?: number;
  longitude?: number;
  onChange: (patch: {
    address?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}) {
  const [locating, setLocating] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ latitude: coords.latitude, longitude: coords.longitude });
        toast.success("موقعیت ثبت شد؛ نشانی دقیق را هم وارد کنید.");
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت ممکن نشد؛ نشانی را دستی وارد کنید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        متخصص به کدام نشانی بیاید؟
      </h2>
      <p className="mt-1 text-sm text-foreground/55">
        نشانی و موقعیت دقیق باعث می‌شود متخصص مناسب درخواست را ببیند و برای
        هماهنگی با شما تماس بگیرد.
      </p>

      <label
        htmlFor="service-address"
        className="mt-5 block text-sm font-medium text-foreground"
      >
        نشانی کامل
      </label>
      <div className="relative mt-2">
        <MapPin
          size={18}
          className="pointer-events-none absolute start-3 top-3.5 text-foreground/35"
        />
        <textarea
          id="service-address"
          rows={3}
          value={value}
          onChange={(event) => onChange({ address: event.target.value })}
          placeholder="استان، شهر، محله، خیابان، کوچه و پلاک"
          className="w-full resize-y rounded-xl border border-foreground/15 bg-background py-3 ps-10 pe-3.5 text-sm leading-6 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.05] px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          {latitude !== undefined && longitude !== undefined ? (
            <Check size={17} />
          ) : (
            <Navigation size={17} />
          )}
          {locating
            ? "در حال دریافت موقعیت…"
            : latitude !== undefined
              ? "موقعیت ثبت شد"
              : "ثبت موقعیت فعلی"}
        </button>
        {latitude !== undefined && longitude !== undefined && (
          <span className="text-xs text-foreground/45" dir="ltr">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-foreground/45">
        استفاده از موقعیت فعلی اختیاری است؛ برای پیدا شدن محل، نشانی کامل را
        وارد کنید.
      </p>
    </div>
  );
}
