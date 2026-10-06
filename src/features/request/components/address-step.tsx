"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { MapPin, Navigation, Check } from "lucide-react";

const AddressMap = dynamic(() => import("./addressmap"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl bg-foreground/[0.06]" />
  ),
});

export function AddressStep({
  value,
  latitude,
  longitude,
  cityWide = false,
  serviceRadiusKm = 10,
  prefersOutOfArea = false,
  onChange,
}: {
  value: string;
  latitude?: number;
  longitude?: number;
  cityWide?: boolean;
  serviceRadiusKm?: number;
  prefersOutOfArea?: boolean;
  onChange: (patch: {
    address?: string;
    latitude?: number;
    longitude?: number;
    cityWide?: boolean;
    serviceRadiusKm?: number;
    prefersOutOfArea?: boolean;
  }) => void;
}) {
  const [locating, setLocating] = useState(false);
  const hasLocation = latitude !== undefined && longitude !== undefined;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ latitude: coords.latitude, longitude: coords.longitude });
        toast.success("موقعیت ثبت شد؛ در صورت نیاز پین را روی نقشه اصلاح کنید.");
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت ممکن نشد؛ نقشه را حرکت دهید.");
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

      <div className="mt-5 rounded-2xl border border-foreground/10 bg-card p-4">
        <p className="text-sm font-medium text-foreground">محدوده خدمات مورد نیاز</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-sm text-foreground/75">
            <span>در شهر فعلی</span>
            <input
              type="radio"
              name="service-area-mode"
              checked={cityWide}
              onChange={() => onChange({ cityWide: true, serviceRadiusKm: 0 })}
              className="h-4 w-4 accent-primary"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-sm text-foreground/75">
            <span>تا شعاع مشخص</span>
            <input
              type="radio"
              name="service-area-mode"
              checked={!cityWide}
              onChange={() => onChange({ cityWide: false, serviceRadiusKm: serviceRadiusKm || 10 })}
              className="h-4 w-4 accent-primary"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor="radius-km" className="text-xs text-foreground/60">
            شعاع خدمات (کیلومتر)
          </label>
          <input
            id="radius-km"
            type="number"
            min={1}
            max={200}
            step={1}
            value={cityWide ? 0 : serviceRadiusKm}
            disabled={cityWide}
            onChange={(event) =>
              onChange({
                cityWide: false,
                serviceRadiusKm: Number(event.target.value) || 10,
              })
            }
            className="h-10 w-24 rounded-xl border border-foreground/15 bg-background px-2 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/[0.03] p-3 text-xs leading-6 text-foreground/60">
        اگر متخصص در محدوده‌ی مدنظر پیدا نشد، می‌توانید برای درخواست فوری گزینه‌ی
        «پیشنهاد متخصص خارج از محدوده با هزینه بیشتر» را فعال کنید.
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-sm text-foreground/75">
        <span>در صورت نبود متخصص در محدوده، امکان پیشنهاد متخصص خارج از محدوده با هزینه بیشتر</span>
        <input
          type="checkbox"
          checked={prefersOutOfArea}
          onChange={(event) =>
            onChange({ prefersOutOfArea: event.target.checked })
          }
          className="h-4 w-4 accent-primary"
        />
      </label>

      <p className="mt-5 text-sm font-medium text-foreground">
        موقعیت روی نقشه
      </p>
      <p className="mt-1 mb-2 text-xs text-foreground/50">
        نقشه را حرکت دهید تا پین روی محل دقیق قرار بگیرد.
      </p>
      <AddressMap
        latitude={latitude}
        longitude={longitude}
        onMove={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.05] px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          {hasLocation ? <Check size={17} /> : <Navigation size={17} />}
          {locating
            ? "در حال دریافت موقعیت…"
            : hasLocation
              ? "ثبت مجدد موقعیت فعلی"
              : "ثبت موقعیت فعلی"}
        </button>
        {hasLocation && (
          <span className="text-xs text-foreground/45" dir="ltr">
            {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-foreground/45">
        انتخاب موقعیت روی نقشه اختیاری است؛ ولی نشانی کامل را حتماً وارد کنید.
      </p>
    </div>
  );
}