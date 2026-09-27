"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, MapPin, Navigation, Save } from "lucide-react";
import { SectionCard } from "@/src/components/shared/section-card";
import { Button } from "@/src/components/ui/button";
import { providerApi } from "../../api/provider.api";

export function ServiceAreaEditor({
  initialLatitude,
  initialLongitude,
}: {
  initialLatitude: number | null;
  initialLongitude: number | null;
}) {
  const [latitude, setLatitude] = useState(
    initialLatitude === null ? "" : String(initialLatitude),
  );
  const [longitude, setLongitude] = useState(
    initialLongitude === null ? "" : String(initialLongitude),
  );
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(coords.latitude.toFixed(6));
        setLongitude(coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت انجام نشد. مجوز مکان‌یابی را بررسی کنید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const save = async () => {
    const latitudeValue = Number(latitude);
    const longitudeValue = Number(longitude);
    if (
      !latitude.trim() ||
      !longitude.trim() ||
      !Number.isFinite(latitudeValue) ||
      !Number.isFinite(longitudeValue) ||
      latitudeValue < -90 ||
      latitudeValue > 90 ||
      longitudeValue < -180 ||
      longitudeValue > 180
    ) {
      toast.error("موقعیت مکانی معتبر وارد کنید");
      return;
    }

    setSaving(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) throw new Error("نشست شما منقضی شده است");
      await providerApi.updateProfile(
        {
          serviceAreaLatitude: latitudeValue,
          serviceAreaLongitude: longitudeValue,
        },
        session.accessToken,
      );
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
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="space-y-2 text-sm font-medium text-foreground">
          عرض جغرافیایی
          <input
            inputMode="decimal"
            dir="ltr"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            placeholder="35.7219"
            className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 text-start text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          طول جغرافیایی
          <input
            inputMode="decimal"
            dir="ltr"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            placeholder="51.3347"
            className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 text-start text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={locate}
            disabled={locating}
            aria-label="ثبت موقعیت فعلی"
          >
            {locating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Navigation size={16} />
            )}
          </Button>
          <Button
            type="button"
            onClick={save}
            disabled={saving}
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
      </div>
      {latitude && longitude && (
        <p
          className="mt-3 flex items-center gap-1.5 text-xs text-foreground/50"
          dir="ltr"
        >
          <MapPin size={13} /> {latitude}, {longitude}
        </p>
      )}
    </SectionCard>
  );
}
