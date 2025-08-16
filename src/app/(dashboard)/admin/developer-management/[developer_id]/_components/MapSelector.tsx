"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapSelectorProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({
  onLocationSelect,
  latitude,
  longitude,
}: MapSelectorProps) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} />
  ) : null;
}

export default function MapSelector({
  latitude,
  longitude,
  onLocationSelect,
}: MapSelectorProps) {
  const center: [number, number] = [latitude || -6.2088, longitude || 106.8456]; // Default to Jakarta

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
}
