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