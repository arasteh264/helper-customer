"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, MapPin, Navigation, Search, Save } from "lucide-react";
import { SectionCard } from "@/src/components/shared/section-card";
import { Button } from "@/src/components/ui/button";
import { providerApi } from "../../api/provider.api";

interface PlaceFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    osm_key?: string;
    osm_value?: string;
    type?: string;
  };
}

interface PlaceSearchResponse {
  features?: PlaceFeature[];
}

interface PlaceResult {
  label: string;
  latitude: number;
  longitude: number;
}

// Leaflet به window نیاز دارد → فقط سمت کلاینت
const ServiceAreaMap = dynamic(() => import("./service-area-map"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-xl bg-foreground/[0.06] sm:h-72" />
  ),
});

export function ServiceAreaEditor({
  initialLatitude,
  initialLongitude,
  initialRadiusKm = 10,
}: {
  initialLatitude: number | null;
  initialLongitude: number | null;
  initialRadiusKm?: number | null;
}) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLatitude !== null && initialLongitude !== null
      ? { lat: initialLatitude, lng: initialLongitude }
      : null,
  );
  const [radiusKm, setRadiusKm] = useState<number>(initialRadiusKm ?? 10);
  const [dirty, setDirty] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [placeLabel, setPlaceLabel] = useState("");

  const move = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setDirty(true);
    setPlaceLabel("");
  };

  const searchPlaces = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchError("نام محله یا شهر را کامل‌تر وارد کنید.");
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const searchText = /ایران|iran/i.test(query) ? query : `${query} ایران`;
      const response = await fetch(
        `/api/location-search?q=${encodeURIComponent(searchText)}`,
      );
      if (!response.ok) {
        throw new Error("جست‌وجوی محله در حال حاضر در دسترس نیست.");
      }

      const result = (await response.json()) as PlaceSearchResponse;
      const features = result.features ?? [];
      const neighborhoodFeatures = features.filter((feature) => {
        const { osm_key, osm_value, type } = feature.properties;
        return (
          osm_key === "place" ||
          ["city", "town", "village", "suburb", "locality"].includes(
            (type ?? "").toLowerCase(),
          ) ||
          ["neighbourhood", "suburb", "quarter", "district"].includes(
            (osm_value ?? "").toLowerCase(),
          )
        );
      });
      const places = (neighborhoodFeatures.length
        ? neighborhoodFeatures
        : features
      )
        .map((feature): PlaceResult | null => {
          const [longitude, latitude] = feature.geometry.coordinates;
          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            Math.abs(latitude) > 90 ||
            Math.abs(longitude) > 180
          ) {
            return null;
          }
          const properties = feature.properties;
          const country = properties.country ?? "";
          if (country && !/ایران|iran/i.test(country)) return null;
          const label = [
            properties.name,
            properties.district,
            properties.city ?? properties.county,
            properties.state,
            country,
          ]
            .filter((part): part is string => Boolean(part?.trim()))
            .filter((part, index, all) => all.indexOf(part) === index)
            .join("، ");
          if (!label) return null;
          return { label, latitude, longitude };
        })
        .filter((place): place is PlaceResult => place !== null);

      setSearchResults(places);
      if (places.length === 0) {
        setSearchError(
          "محله‌ای پیدا نشد؛ نام شهر را هم اضافه کنید یا موقعیت را روی نقشه انتخاب کنید.",
        );
      }
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "جست‌وجوی محله انجام نشد. موقعیت را روی نقشه انتخاب کنید.",
      );
    } finally {
      setSearching(false);
    }
  };

  const selectPlace = (place: PlaceResult) => {
    setCoords({ lat: place.latitude, lng: place.longitude });
    setPlaceLabel(place.label);
    setSearchQuery(place.label);
    setSearchResults([]);
    setSearchError("");
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
          serviceAreaRadiusKm: Math.min(200, Math.max(1, Number(radiusKm) || 10)),
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
        محله را جست‌وجو کنید یا روی نقشه بزنید و پین را جابه‌جا کنید؛ نشانی دقیق
        شما نمایش داده نمی‌شود.
      </p>

      <form onSubmit={searchPlaces} className="mb-4 space-y-2">
        <label
          htmlFor="provider-neighborhood-search"
          className="block text-sm font-medium text-foreground"
        >
          جست‌وجوی محله یا شهر
        </label>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2">
          <input
            id="provider-neighborhood-search"
            type="search"
            maxLength={100}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="مثلاً گوهردشت، کرج"
            autoComplete="off"
            className="h-11 min-w-0 rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <Button
            type="submit"
            disabled={searching || searchQuery.trim().length < 2}
            className="min-h-11 min-w-11 gap-2 px-3"
            aria-label="جست‌وجوی محله"
          >
            {searching ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Search size={17} />
            )}
            <span className="hidden sm:inline">جست‌وجو</span>
          </Button>
        </div>
        {searchError ? (
          <p className="text-sm leading-6 text-destructive" role="status">
            {searchError}
          </p>
        ) : null}
        {searchResults.length > 0 ? (
          <ul
            className="space-y-1 rounded-xl border border-foreground/10 bg-background p-2"
            aria-label="نتایج جست‌وجوی محله"
          >
            {searchResults.map((place, index) => (
              <li key={`${place.latitude}-${place.longitude}-${index}`}>
                <button
                  type="button"
                  onClick={() => selectPlace(place)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm leading-5 text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MapPin size={16} className="shrink-0 text-primary" />
                  <span className="min-w-0 break-words">{place.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </form>

      <div className="mb-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-xl bg-foreground/[0.03] p-3 sm:grid-cols-[auto_7rem_minmax(0,1fr)]">
        <label
          htmlFor="provider-radius"
          className="text-sm font-medium text-foreground"
        >
          شعاع خدمات
          <span className="block text-xs font-normal text-foreground/55 sm:inline">
            {" "}
            (کیلومتر)
          </span>
        </label>
        <input
          id="provider-radius"
          type="number"
          min={1}
          max={200}
          step={1}
          inputMode="numeric"
          value={radiusKm}
          onChange={(event) => {
            const next = Number(event.target.value) || 10;
            setRadiusKm(Math.min(200, Math.max(1, next)));
            setDirty(true);
          }}
          className="h-11 w-20 rounded-xl border border-foreground/15 bg-background px-2 text-center text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-full"
        />
        <span className="col-span-2 text-xs leading-5 text-foreground/55 sm:col-span-1">
          درخواست‌ها تا این فاصله برایتان پیشنهاد می‌شوند.
        </span>
      </div>

      {placeLabel ? (
        <p className="mb-3 flex min-w-0 items-start gap-2 text-sm leading-6 text-foreground/70">
          <MapPin size={17} className="mt-1 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{placeLabel}</span>
        </p>
      ) : null}

      <ServiceAreaMap
        latitude={coords?.lat}
        longitude={coords?.lng}
        radiusKm={radiusKm}
        onMove={move}
      />

      <div className="mt-4 grid min-w-0 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="grid min-w-0 gap-2 sm:flex sm:items-center sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={locate}
            disabled={locating}
            className="min-h-11 w-full gap-2 sm:w-auto"
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
              className="flex min-w-0 items-center gap-1.5 break-all text-xs text-foreground/50 sm:break-normal"
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
          className="min-h-11 w-full gap-2 sm:w-auto"
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