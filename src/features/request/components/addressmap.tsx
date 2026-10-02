"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

const DEFAULT_CENTER: [number, number] = [35.6892, 51.389]; // تهران
const EPS = 1e-6;

// برای نشان: آدرس تایل را با کلید خودتان جایگزین کنید.
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = "© OpenStreetMap";

export default function AddressMap({
  latitude,
  longitude,
  onMove,
}: {
  latitude?: number;
  longitude?: number;
  onMove: (latitude: number, longitude: number) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onMoveRef = useRef(onMove);
  const propsRef = useRef({ latitude, longitude });
  onMoveRef.current = onMove;
  propsRef.current = { latitude, longitude };

  // ساخت نقشه (یک بار)
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const has = latitude !== undefined && longitude !== undefined;
    const map = L.map(elRef.current).setView(
      has ? [latitude!, longitude!] : DEFAULT_CENTER,
      has ? 16 : 12,
    );
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTR }).addTo(map);

    map.on("moveend", () => {
      const c = map.getCenter();
      const { latitude: la, longitude: lo } = propsRef.current;
      // حرکتی که از خود props آمده را دوباره گزارش نکن
      if (
        la !== undefined &&
        lo !== undefined &&
        Math.abs(c.lat - la) < EPS &&
        Math.abs(c.lng - lo) < EPS
      )
        return;
      onMoveRef.current(c.lat, c.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // وقتی مختصات از بیرون عوض شد (مثلاً «موقعیت فعلی»)، نقشه را ببر آنجا
  useEffect(() => {
    const map = mapRef.current;
    if (!map || latitude === undefined || longitude === undefined) return;
    const c = map.getCenter();
    if (Math.abs(c.lat - latitude) > EPS || Math.abs(c.lng - longitude) > EPS) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 16));
    }
  }, [latitude, longitude]);

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-foreground/15">
      <div ref={elRef} className="h-full w-full" dir="ltr" />
      {/* پین ثابت وسط نقشه؛ نوک پین روی مرکز است */}
      <MapPin
        size={36}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full fill-primary/20 text-primary drop-shadow"
      />
    </div>
  );
}