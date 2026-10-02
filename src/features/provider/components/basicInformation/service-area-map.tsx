"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TEHRAN: [number, number] = [35.7219, 51.3347];

// آیکن پین با divIcon تا به فایل‌های تصویری پیش‌فرض Leaflet نیازی نباشد
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#2563eb;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

interface Props {
  latitude?: number;
  longitude?: number;
  /** شعاع محدوده به کیلومتر؛ اگر نباشد دایره نشان داده نمی‌شود */
  radiusKm?: number;
  onMove: (lat: number, lng: number) => void;
}

export default function ServiceAreaMap({
  latitude,
  longitude,
  radiusKm,
  onMove,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // ساخت نقشه (یک بار)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const hasPoint = latitude !== undefined && longitude !== undefined;
    const map = L.map(containerRef.current, {
      center: hasPoint ? [latitude!, longitude!] : TEHRAN,
      zoom: hasPoint ? 13 : 11,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      onMoveRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // همگام‌سازی پین و دایره با props
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude === undefined || longitude === undefined) {
      markerRef.current?.remove();
      circleRef.current?.remove();
      markerRef.current = null;
      circleRef.current = null;
      return;
    }

    const point: L.LatLngExpression = [latitude, longitude];

    if (!markerRef.current) {
      const marker = L.marker(point, { icon: pinIcon, draggable: true }).addTo(
        map,
      );
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onMoveRef.current(lat, lng);
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(point);
    }

    if (radiusKm && radiusKm > 0) {
      if (!circleRef.current) {
        circleRef.current = L.circle(point, {
          radius: radiusKm * 1000,
          color: "#2563eb",
          weight: 2,
          fillOpacity: 0.12,
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(point);
        circleRef.current.setRadius(radiusKm * 1000);
      }
    } else {
      circleRef.current?.remove();
      circleRef.current = null;
    }

    if (!map.getBounds().contains(point)) map.panTo(point);
  }, [latitude, longitude, radiusKm]);

  return (
    <div
      ref={containerRef}
      className="z-0 h-72 w-full overflow-hidden rounded-xl border border-foreground/15"
    />
  );
}