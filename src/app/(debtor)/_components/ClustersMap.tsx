"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useClusters } from "@/services/clusterServices";
import type { Cluster } from "@/types/cluster";
import Link from "next/link";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const houseIcon = L.icon({
  iconUrl: "/images/house-icon.png",
  iconRetinaUrl: "/images/house-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

const formatIDR = (val?: string | number) => {
  if (val === undefined || val === null) return "-";
  const num = typeof val === "string" ? Number(val) : val;
  if (!Number.isFinite(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function ClustersMap() {
  const pageNumber = 1;
  const pageSize = 9999;
  const { data, isPending, isError, refetch } = useClusters(
    pageNumber,
    pageSize
  );
  const clusters = data?.data?.clusters ?? [];
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation tidak didukung browser ini.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => setGeoError(err?.message || "Gagal mendapatkan lokasi."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clusterPoints = useMemo(() => {
    return clusters
      .map((c) => {
        const lat = Number(c.latitude);
        const lng = Number(c.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng, c };
      })
      .filter(Boolean) as { lat: number; lng: number; c: Cluster }[];
  }, [clusters]);

  const defaultCenter: [number, number] =
    userPos ?? ([-6.2, 106.816666] as [number, number]);

  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (map && userPos) {
      map.setView(userPos, 11);
    }
  }, [map, userPos]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary-black">
          Temukan Cluster Perumahan di Sekitar Anda
        </h2>

        <div className="text-sm text-gray-600">
          {isPending
            ? "Memuat cluster…"
            : `Menampilkan ${clusters.length} cluster`}
          {isError && (
            <button
              className="ml-2 px-2 py-1 rounded border"
              onClick={() => refetch()}
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom
          className="h-[70vh] [&_.leaflet-pane]:!z-48 w-full rounded-lg [&_.leaflet-top]:!z-[49] [&_.leaflet-bottom]:!z-[49]"
          ref={setMap}
          whenReady={() => {
            if (userPos) map?.setView(userPos, 14);
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
            {clusterPoints.map(({ lat, lng, c }) => (
              <Marker key={c.id} position={[lat, lng]} icon={houseIcon}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{c.name}</div>

                    <div className="text-xs text-gray-600">
                      {c.developerName}
                    </div>

                    <div className="text-xs">
                      {formatIDR(c.minPrice)} – {formatIDR(c.maxPrice)}
                    </div>

                    <div className="text-xs">{c.address}</div>

                    {c.cluster_photo_urls?.length ? (
                      <img
                        src={c.cluster_photo_urls[0]!}
                        alt={c.name}
                        className="mt-1 w-full h-24 object-cover rounded"
                      />
                    ) : null}

                    <Link
                      href={`/developers/${c.developerId}/clusters/${c.id}`}
                      className="block"
                    >
                      <button className="mt-2 w-full px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 cursor-pointer">
                        Lihat Selengkapnya
                      </button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {userPos && (
            <Marker position={userPos}>
              <Popup>Lokasi Anda saat ini</Popup>
            </Marker>
          )}
        </MapContainer>

        <div className="absolute right-3 top-3 z-[49]">
          <button
            className="px-3 py-1.5 rounded-md border bg-white shadow"
            onClick={() => userPos && map?.setView(userPos, 14)}
            disabled={!userPos}
          >
            Ke Lokasi Saya
          </button>
        </div>
      </div>

      {geoError && (
        <p className="text-xs text-red-600">
          Lokasi pengguna tidak diizinkan. Mohon berikan akses lokasi di browser
          Anda.
        </p>
      )}
    </div>
  );
}
