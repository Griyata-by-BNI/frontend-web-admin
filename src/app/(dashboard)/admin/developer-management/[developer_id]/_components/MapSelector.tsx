"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

// Fix default marker icons (compatible dgn Leaflet 1.9+)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapSelectorProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  /** zoom saat flyTo; default 13 */
  flyZoom?: number;
}

/** Komponen untuk memastikan map “nge-render penuh” saat container berubah ukuran */
function InvalidateOnResize({ container }: { container: HTMLElement | null }) {
  const map = useMap();

  useEffect(() => {
    if (!container) return;

    // on first ready
    map.whenReady(() => {
      // kecil kemungkinan perlu next tick agar style terset dulu
      requestAnimationFrame(() => map.invalidateSize());
    });

    // observe resize (Collapse open/close, modal show, tab switch, dll)
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [container, map]);

  return null;
}

/** Komponen untuk flyTo ketika lat/lng berubah */
function FlyToOnChange({
  lat,
  lng,
  zoom = 13,
  delay = 400, // debounce delay dalam ms
}: {
  lat?: number;
  lng?: number;
  zoom?: number;
  delay?: number;
}) {
  const map = useMap();
  const hasLatLng = lat !== undefined && lng !== undefined;

  useEffect(() => {
    if (!hasLatLng) return;
    const id = setTimeout(() => {
      map.flyTo([lat as number, lng as number], zoom, {
        animate: true,
        duration: 0.8,
      });
    }, delay);

    return () => clearTimeout(id); // cancel kalau ada perubahan sebelum delay selesai
  }, [lat, lng, zoom, map, hasLatLng, delay]);

  return null;
}

/** Marker + click untuk pilih lokasi */
function ClickToSelect({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onLocationSelect]);

  return null;
}

export default function MapSelector({
  latitude,
  longitude,
  onLocationSelect,
  flyZoom = 13,
}: MapSelectorProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const hasLatLng = latitude !== undefined && longitude !== undefined;

  // Center awal (fallback Jakarta)
  const initialCenter = useMemo<[number, number]>(
    () => [
      hasLatLng ? (latitude as number) : -6.2088,
      hasLatLng ? (longitude as number) : 106.8456,
    ],
    [hasLatLng, latitude, longitude]
  );

  return (
    <div
      ref={wrapperRef}
      className="w-full rounded-lg overflow-hidden border border-gray-200"
      style={{ height: 320 }} // pastikan tinggi fixed; bisa ganti dengan h-64 md:h-96 via class
    >
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        preferCanvas={false}
      >
        <TileLayer
          // OSM public tiles
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Pastikan map invalidate saat container berubah ukuran */}
        <InvalidateOnResize container={wrapperRef.current} />

        {/* Fly ke koordinat baru saat props berubah */}
        <FlyToOnChange lat={latitude} lng={longitude} zoom={flyZoom} />

        {/* Klik peta untuk memilih koordinat */}
        <ClickToSelect onLocationSelect={onLocationSelect} />

        {/* Tampilkan marker jika sudah ada koordinat */}
        {hasLatLng && (
          <Marker position={[latitude as number, longitude as number]} />
        )}
      </MapContainer>
    </div>
  );
}
