import { usePropertiesByClusterType } from "@/services/propertyServices";
import { useMemo } from "react";
import PropertyCard from "@/app/(debtor)/search/_components/PropertyCard";
import LatestClusterCardSkeleton from "@/app/(debtor)/_components/latestCluster/LatestClusterCardSkeleton";

export interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

interface PropertyCardShape {
  id: number;
  developerId: number;
  clusterId: number;
  location: string;
  propertyName: string;
  developerName: string;
  price: number;
  installment?: number;
  facilities: Facility[];
  updatedAt: string;
  photoUrl: string;
  clusterTypeName: string;
}

interface PropertyTypeItemProps {
  type: any;
  clusterDetail: any;
}

export default function PropertyTypeItem({
  type,
  clusterDetail,
}: PropertyTypeItemProps) {
  const { data, isLoading } = usePropertiesByClusterType(type.id);
  const properties = useMemo(() => data?.data || [], [data]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full md:w-1/2">
              <LatestClusterCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!properties?.length) return null;

  return (
    <div className="md:p-6 rounded-xl md:border border-gray-200 bg-white relative">
      <h3 className="text-lg font-bold text-dark-tosca mb-3">{type.name}</h3>

      <div className="flex gap-4 max-w-full overflow-x-auto overflow-y-visible pb-4 -mb-2 relative z-10 no-scrollbar">
        {properties.map((prop: any) => {
          const rawFacilities: Facility[] = [
            { name: "KT", value: prop.jumlahKamarTidur || 0 },
            { name: "KM", value: prop.jumlahKamarMandi || 0 },
            { name: "LB", value: prop.buildingArea || 0 },
            { name: "LT", value: prop.landArea || 0 },
          ];

          const propertyForCard: PropertyCardShape = {
            id: prop.propertyId,
            propertyName: prop.name,
            developerId: clusterDetail.developerId,
            clusterId: clusterDetail.id,
            location: clusterDetail.address || prop.location || "N/A",
            developerName: clusterDetail.developerName,
            price: Number(prop.price) || 0,
            facilities: rawFacilities.filter((f) => f.value > 0),
            updatedAt: prop.updated_at,
            photoUrl: prop.property_photo_urls?.[0] || null,
            clusterTypeName: type.name,
          };

          return (
            <div
              key={`${type.id}-${prop.propertyId}`}
              className="w-full md:w-1/2 relative z-10"
            >
              <PropertyCard property={propertyForCard} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
