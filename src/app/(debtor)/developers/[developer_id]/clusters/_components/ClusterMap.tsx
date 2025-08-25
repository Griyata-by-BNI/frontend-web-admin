import { MapWithNearbyPlaces } from "./MapWithNearbyPlaces";

interface ClusterMapProps {
  clusterDetail: any;
}

export default function ClusterMap({ clusterDetail }: ClusterMapProps) {
  const areCoordinatesValid =
    clusterDetail.latitude &&
    clusterDetail.longitude &&
    !isNaN(Number(clusterDetail.latitude)) &&
    !isNaN(Number(clusterDetail.longitude));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-lg shadow-gray-500/10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Lokasi & Tempat Terdekat
      </h2>
      {areCoordinatesValid ? (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <MapWithNearbyPlaces
            center={[
              Number(clusterDetail.latitude),
              Number(clusterDetail.longitude),
            ]}
            popupText={`Lokasi ${clusterDetail.name}`}
            nearbyPlaces={
              Array.isArray(clusterDetail.nearbyPlaces)
                ? clusterDetail.nearbyPlaces
                : []
            }
          />
        </div>
      ) : (
        <p className="text-gray-500">Peta lokasi tidak tersedia.</p>
      )}
    </div>
  );
}
