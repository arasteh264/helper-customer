"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Check, LoaderCircle, MapPin, Navigation, Search } from "lucide-react";

const AddressMap = dynamic(() => import("./addressmap"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl bg-foreground/[0.06]" />
  ),
});

type GeocodingResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string | undefined>;
};

type AddressSuggestion = {
  label: string;
  latitude: number;
  longitude: number;
};

function addressLabel(result: GeocodingResult) {
  const address = result.address;
  if (!address) return result.display_name;
  const parts = [
    address.city ?? address.town ?? address.village ?? address.county,
    address.suburb ?? address.neighbourhood ?? address.city_district,
    address.road ?? address.pedestrian ?? address.residential,
  ].filter((part): part is string => Boolean(part));
  return [...new Set(parts)].join("، ") || result.display_name;
}

export function AddressStep({
  value,
  plaque,
  unit,
  latitude,
  longitude,
  onChange,
}: {
  value: string;
  plaque: string;
  unit: string;
  latitude?: number;
  longitude?: number;
  onChange: (patch: {
    address?: string;
    plaque?: string;
    unit?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}) {
  const [locating, setLocating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const hasLocation = latitude !== undefined && longitude !== undefined;
  const reverseLookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reverseLookupSequence = useRef(0);

  useEffect(() => {
    if (!hasLocation) return;
    if (reverseLookupTimer.current) clearTimeout(reverseLookupTimer.current);
    const sequence = ++reverseLookupSequence.current;
    reverseLookupTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          lat: String(latitude),
          lon: String(longitude),
          zoom: "18",
          addressdetails: "1",
          "accept-language": "fa",
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params}`,
          { headers: { Accept: "application/json" } },
        );
        if (!response.ok) throw new Error("دریافت نشانی تقریبی ناموفق بود");
        const result = (await response.json()) as GeocodingResult;
        if (sequence === reverseLookupSequence.current && result.address) {
          const label = addressLabel(result);
          if (label) onChange({ address: label });
        }
      } catch {
        // The user can still enter the address manually if reverse lookup is unavailable.
      }
    }, 1000);

    return () => {
      if (reverseLookupTimer.current) clearTimeout(reverseLookupTimer.current);
    };
  }, [hasLocation, latitude, longitude, onChange]);

  const searchAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchText.trim();
    if (query.length < 3) {
      toast.error("نام شهر یا محله را کامل‌تر وارد کنید");
      return;
    }
    setSearching(true);
    setSuggestions([]);
    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        q: `${query}, Iran`,
        countrycodes: "ir",
        addressdetails: "1",
        limit: "5",
        "accept-language": "fa",
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) throw new Error("جست‌وجوی نشانی ناموفق بود");
      const results = (await response.json()) as GeocodingResult[];
      const matches = results
        .map((result) => ({
          label: addressLabel(result),
          latitude: Number(result.lat),
          longitude: Number(result.lon),
        }))
        .filter(
          (result) =>
            result.label &&
            Number.isFinite(result.latitude) &&
            Number.isFinite(result.longitude),
        );
      if (!matches.length) {
        toast.error("نشانی‌ای برای این جست‌وجو پیدا نشد");
        return;
      }
      const bestMatch = matches[0];
      onChange({
        latitude: bestMatch.latitude,
        longitude: bestMatch.longitude,
        address: bestMatch.label,
      });
      setSearchText(bestMatch.label);
      setSuggestions(matches);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "جست‌وجوی نشانی انجام نشد؛ نقشه را دستی جابه‌جا کنید.",
      );
    } finally {
      setSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ latitude: coords.latitude, longitude: coords.longitude });
        toast.success("موقعیت روی نقشه ثبت شد");
        setLocating(false);
      },
      () => {
        toast.error("دریافت موقعیت ممکن نشد؛ محل را روی نقشه انتخاب کنید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        محل انجام کار را مشخص کنید
      </h2>
      <p className="mt-1 text-sm leading-6 text-foreground/55">
        ابتدا موقعیت محل را روی نقشه انتخاب کنید؛ بعد نشانی دقیق، پلاک و واحد را
        بنویسید. محدوده‌ی خدمات را متخصص تعیین می‌کند.
      </p>

      <p className="mt-5 text-sm font-medium text-foreground">
        ۱. موقعیت روی نقشه
      </p>
      <form
        onSubmit={searchAddress}
        className="mt-3 flex gap-2"
        role="search"
        aria-label="جست‌وجوی نشانی"
      >
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="مثلاً: تهرانسر، تهران"
          aria-label="شهر یا محله"
          className="h-11 min-w-0 flex-1 rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
        <button
          type="submit"
          disabled={searching}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {searching ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          جست‌وجو
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-xl border border-foreground/10 bg-card">
          {suggestions.map((suggestion) => (
            <li key={`${suggestion.latitude}-${suggestion.longitude}`}>
              <button
                type="button"
                onClick={() => {
                  onChange({
                    latitude: suggestion.latitude,
                    longitude: suggestion.longitude,
                    address: suggestion.label,
                  });
                  setSearchText(suggestion.label);
                  setSuggestions([]);
                }}
                className="flex w-full items-start gap-2 border-b border-foreground/[0.06] px-3 py-2.5 text-start text-sm last:border-0 hover:bg-primary/[0.04]"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 mb-2 text-xs text-foreground/50">
        نشانی را جست‌وجو کنید یا نقشه را جابه‌جا کنید تا نشانگر روی محل کار
        قرار بگیرد. نام محله‌ی نزدیک به موقعیت انتخاب‌شده در نشانی پر می‌شود.
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
              : "استفاده از موقعیت فعلی"}
        </button>
        {hasLocation && (
          <span className="text-xs text-foreground/45" dir="ltr">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </div>
      {!hasLocation && (
        <p className="mt-2 text-xs text-amber-700">
          برای ادامه، موقعیت محل کار را با حرکت دادن نقشه یا دکمه‌ی موقعیت فعلی
          ثبت کنید.
        </p>
      )}

      <div className="mt-6 space-y-4 border-t border-foreground/10 pt-5">
        <p className="text-sm font-medium text-foreground">
          ۲. نشانی دقیق محل
        </p>
        <div className="space-y-2">
          <label
            htmlFor="service-address"
            className="block text-sm font-medium text-foreground"
          >
            نشانی کامل
            <span className="ms-1 font-normal text-foreground/45">
              (حدودی)
            </span>
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="pointer-events-none absolute start-3 top-3.5 text-foreground/35"
            />
            <textarea
              id="service-address"
              rows={3}
              value={value}
              onChange={(event) => onChange({ address: event.target.value })}
              placeholder="شهر، محله، خیابان و کوچه"
              className="w-full resize-y rounded-xl border border-foreground/15 bg-background py-3 ps-10 pe-3.5 text-sm leading-6 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="service-plaque"
              className="block text-sm font-medium text-foreground"
            >
              شماره پلاک (اختیاری)
            </label>
            <input
              id="service-plaque"
              value={plaque}
              onChange={(event) => onChange({ plaque: event.target.value })}
              placeholder="مثلاً ۱۲"
              maxLength={30}
              className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="service-unit"
              className="block text-sm font-medium text-foreground"
            >
              طبقه یا واحد (اختیاری)
            </label>
            <input
              id="service-unit"
              value={unit}
              onChange={(event) => onChange({ unit: event.target.value })}
              placeholder="مثلاً طبقه ۳، واحد ۷"
              maxLength={30}
              className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
