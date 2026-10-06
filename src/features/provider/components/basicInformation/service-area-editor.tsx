"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, MapPin, Navigation, Save } from "lucide-react";
import { SectionCard } from "@/src/components/shared/section-card";
import { Button } from "@/src/components/ui/button";
import { providerApi } from "../../api/provider.api";

// Leaflet به window نیاز دارد → فقط سمت کلاینت
const ServiceAreaMap = dynamic(() => import("./service-area-map"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl bg-foreground/[0.06]" />
  ),
});

export function ServiceAreaEditor({
  initialLatitude,
  initialLongitude,
  initialRadiusKm = 10,
  initialCityWide = false,
}: {
  initialLatitude: number | null;
  initialLongitude: number | null;
  initialRadiusKm?: number | null;
  initialCityWide?: boolean;
}) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLatitude !== null && initialLongitude !== null
      ? { lat: initialLatitude, lng: initialLongitude }
      : null,
  );
  const [radiusKm, setRadiusKm] = useState<number>(initialRadiusKm ?? 10);
  const [cityWide, setCityWide] = useState<boolean>(initialCityWide);
  const [dirty, setDirty] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  const move = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setDirty(true);
  };

  const locate = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        move(c.latitude, c.longitude);
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت انجام نشد. نقشه را حرکت دهید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const save = async () => {
    if (!coords) {
      toast.error("ابتدا موقعیت خود را روی نقشه مشخص کنید");
      return;
    }
    setSaving(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) throw new Error("نشست شما منقضی شده است");
      await providerApi.updateProfile(
        {
          serviceAreaLatitude: Number(coords.lat.toFixed(6)),
          serviceAreaLongitude: Number(coords.lng.toFixed(6)),
          serviceAreaRadiusKm: cityWide ? 0 : Math.max(1, Number(radiusKm) || 10),
          serviceAreaCityWide: cityWide,
        },
        session.accessToken,
      );
      setDirty(false);
      toast.success("محدوده‌ی فعالیت ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="service-area"
      title="محدوده‌ی فعالیت"
      description="موقعیت تقریبی فعالیت شما برای پیشنهاد نزدیک‌ترین متخصص به مشتری استفاده می‌شود؛ نشانی دقیق عمومی نیست."
    >
      <p className="mb-2 text-xs text-foreground/50">
        روی نقشه کلیک کنید یا پین را بکشید تا مرکز محدوده‌ی کارتان مشخص شود.
      </p>

      <div className="mb-4 grid gap-3 rounded-2xl border border-foreground/10 bg-card p-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-sm text-foreground/75">
          <span>در کل شهر فعال هستم</span>
          <input
            type="radio"
            name="provider-area-mode"
            checked={cityWide}
            onChange={() => {
              setCityWide(true);
              setDirty(true);
            }}
            className="h-4 w-4 accent-primary"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-sm text-foreground/75">
          <span>تا شعاع مشخص</span>
          <input
            type="radio"
            name="provider-area-mode"
            checked={!cityWide}
            onChange={() => {
              setCityWide(false);
              setDirty(true);
            }}
            className="h-4 w-4 accent-primary"
          />
        </label>
      </div>

      {!cityWide && (
        <div className="mb-4 flex items-center gap-3">
          <label htmlFor="provider-radius" className="text-xs text-foreground/60">
            شعاع خدمات (کیلومتر)
          </label>
          <input
            id="provider-radius"
            type="number"
            min={1}
            max={200}
            step={1}
            value={radiusKm}
            onChange={(event) => {
              const next = Number(event.target.value) || 10;
              setRadiusKm(next);
              setDirty(true);
            }}
            className="h-10 w-24 rounded-xl border border-foreground/15 bg-background px-2 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>
      )}

      <ServiceAreaMap
        latitude={coords?.lat}
        longitude={coords?.lng}
        radiusKm={cityWide ? undefined : radiusKm}
        onMove={move}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={locate}
            disabled={locating}
            className="gap-2"
          >
            {locating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Navigation size={16} />
            )}
            موقعیت فعلی من
          </Button>
          {coords && (
            <span
              className="flex items-center gap-1.5 text-xs text-foreground/50"
              dir="ltr"
            >
              <MapPin size={13} />
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
          )}
        </div>

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
          ذخیره
        </Button>
      </div>
    </SectionCard>
  );
}