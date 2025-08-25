"use client";

import { MapWithNearbyPlaces } from "@/app/(debtor)/developers/components/Map";

interface PropertyLocationProps {
  property: any;
  cluster: any;
}

export default function PropertyLocation({
  property,
  cluster,
}: PropertyLocationProps) {
  const areCoordinatesValid =
    property.latitude &&
    property.longitude &&
    !isNaN(Number(property.latitude)) &&
    !isNaN(Number(property.longitude));

  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Lokasi & Tempat Terdekat
      </h2>
      {areCoordinatesValid ? (
        <div className="rounded-xl overflow-hidden">
          <MapWithNearbyPlaces
            center={[Number(property.latitude), Number(property.longitude)]}
            popupText={`Lokasi ${property.name}`}
            nearbyPlaces={cluster?.nearbyPlaces ?? []}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Peta lokasi tidak tersedia.
        </p>
      )}
    </div>
  );
}