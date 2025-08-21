import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapLoader from "@/app/(debtor)/developers/components/Map";
import { axiosServer } from "@/utils/axios";
import PropertyCard from "@/app/(debtor)/developers/components/PropertyCard";
import ImageSlider from "@/app/(debtor)/developers/components/ImageSlider";

// =================================================================
// INTERFACES
// =================================================================

export interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

export interface Property {
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
  photoUrl: string | null;
}

// =================================================================
// ICONS & HELPER FUNCTIONS
// =================================================================

const SecurityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const PoolIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 2.5c2.5 2.5 2.5 6.25 0 8.75s-6.25 2.5-8.75 0" />
    <path d="M13 13c2.5 2.5 2.5 6.25 0 8.75s-6.25 2.5-8.75 0" />
    <path d="M12.5 2.5c-2.5 2.5-2.5 6.25 0 8.75s6.25 2.5 8.75 0" />
    <path d="M22 13c-2.5 2.5-2.5 6.25 0 8.75s6.25 2.5 8.75 0" />
  </svg>
);
const SchoolIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m4 6 8-4 8 4" />
    <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
    <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
    <path d="M18 5v17" />
    <path d="M6 5v17" />
    <path d="M12 5v6" />
  </svg>
);
const HospitalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 11h4" />
    <path d="M14 9v4" />
  </svg>
);
const MasjidIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 20v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
    <path d="M12 2v12" />
    <path d="M9 14h6" />
    <path d="M12 18a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4z" />
  </svg>
);
const CommunityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LocationPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const formatPrice = (priceString: string | null): string => {
  if (!priceString) return "N/A";
  const price = Number(priceString);
  if (isNaN(price)) return "N/A";
  if (price >= 1_000_000_000)
    return `${(price / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
  if (price >= 1_000_000)
    return `${(price / 1_000_000).toFixed(1).replace(".0", "")} JT`;
  return price.toLocaleString("id-ID");
};

// =================================================================
// API TYPE DEFINITIONS
// =================================================================

interface ApiDeveloper {
  developerPhotoUrl: string;
}

interface ApiClusterDetail {
  id: number;
  developerId: number;
  name: string;
  description: string;
  developerName: string;
  address: string | null;
  latitude: string;
  longitude: string;
  minPrice: string | null;
  maxPrice: string | null;
  facilities: string | null;
  cluster_photo_urls: string[];
}

// ✅ INTERFACE DIPERBARUI
interface ApiProperty {
  id: number;
  propertyId: number;
  name: string;
  price: string | null;
  location: string;
  updated_at: string;
  landArea: number | null;
  buildingArea: number | null;
  jumlahKamarTidur?: number;
  jumlahKamarMandi?: number;
  property_photo_urls?: string[];
}

interface ApiPropertyDetail {
  id: number;
  name: string;
  price: string;
  location: string;
  updatedAt: string;
  landArea: number;
  buildingArea: number;
  jumlahKamarTidur: number;
  jumlahKamarMandi: number;
  property_photo_urls: string[];
}

interface ApiPropertyType {
  id: number;
  cluster_id: number;
  name: string;
  description: string;
  properties?: ApiProperty[];
}

interface ClusterPageData {
  cluster: ApiClusterDetail;
  propertyTypes: ApiPropertyType[];
  developer: ApiDeveloper;
}

// =================================================================
// API FETCHING LOGIC
// =================================================================
async function getClusterPageData(
  developerId: string,
  clusterId: string
): Promise<ClusterPageData | null> {
  try {
    const [clusterRes, typesRes, developerRes] = await Promise.all([
      axiosServer.get<{ data: { clusters: ApiClusterDetail[] } }>(
        `/clusters/${clusterId}`
      ),
      axiosServer.get<{ data: { clusterTypes: ApiPropertyType[] } }>(
        `/clusters/type/cluster/${clusterId}`
      ),
      axiosServer.get<{ data: { developer: ApiDeveloper } }>(
        `/developers/${developerId}`
      ),
    ]);

    const clusterData = clusterRes.data.data.clusters[0];
    const propertyTypesData = typesRes.data.data.clusterTypes;
    const developerData = developerRes.data.data.developer;

    if (!clusterData || !developerData) return null;

    if (propertyTypesData && propertyTypesData.length > 0) {
      const propertyPromises = propertyTypesData.map((type) =>
        axiosServer.get<{ data: ApiProperty[] }>(
          `/properties/cluster-type/${type.id}`
        )
      );
      const propertyResults = await Promise.all(propertyPromises);

      // Fetch full property details for each property to get photos
      for (let i = 0; i < propertyTypesData.length; i++) {
        const properties = propertyResults[i].data.data || [];
        const detailPromises = properties.map((prop) =>
          axiosServer
            .get<{ data: ApiPropertyDetail }>(`/properties/${prop.propertyId}`)
            .catch(() => ({ data: { data: null } }))
        );
        const detailResults = await Promise.all(detailPromises);

        propertyTypesData[i].properties = properties.map((prop, idx) => {
          const detail = detailResults[idx].data.data;
          return {
            ...prop,
            property_photo_urls: detail?.property_photo_urls || [],
          };
        });
      }
    }

    return {
      cluster: clusterData,
      propertyTypes: propertyTypesData || [],
      developer: developerData,
    };
  } catch (error) {
    console.error("Failed to fetch cluster page data:", error);
    return null;
  }
}

// =================================================================
// MAIN PAGE COMPONENT
// =================================================================
export default async function HousingDetailPage({
  params,
}: {
  params: { developer_id: string; cluster_id: string };
}) {
  const data = await getClusterPageData(params.developer_id, params.cluster_id);

  if (!data) {
    notFound();
  }

  const { cluster, propertyTypes, developer } = data;

  const facilityIconMap: { [key: string]: React.ComponentType } = {
    masjid: MasjidIcon,
    security: SecurityIcon,
    "club house": CommunityIcon,
    "swimming pool": PoolIcon,
    "jogging track": CommunityIcon,
    "outdoor playground": CommunityIcon,
    "grocery store": CommunityIcon,
    school: SchoolIcon,
    hospital: HospitalIcon,
  };

  const facilities = (cluster.facilities || "")
    .split(",")
    .map((f) => f.trim().toLowerCase())
    .map((name) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      icon: facilityIconMap[name],
    }))
    .filter((f) => f.icon && f.name);

  const areCoordinatesValid =
    cluster.latitude &&
    cluster.longitude &&
    !isNaN(Number(cluster.latitude)) &&
    !isNaN(Number(cluster.longitude));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <main className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {cluster.name}
            </h1>

            <div className="relative w-full h-96 lg:h-[350px] mb-6">
              <ImageSlider
                urls={cluster.cluster_photo_urls}
                altText={cluster.name}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {cluster.description}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tipe Properti
            </h2>
            <div className="space-y-12 mb-8">
              {(propertyTypes || []).map((type) => (
                <div key={type.id}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {type.name}
                  </h3>

                  {!type.properties || type.properties.length === 0 ? (
                    <p className="text-gray-500">
                      Tidak ada properti yang tersedia untuk tipe ini.
                    </p>
                  ) : (
                    <div className="flex gap-4 max-w-full overflow-x-auto overflow-y-hidden pb-4">
                      {type.properties.map((prop) => {
                        const rawFacilities: Facility[] = [
                          {
                            name: "KT",
                            value: prop.jumlahKamarTidur || 0,
                          },
                          {
                            name: "KM",
                            value: prop.jumlahKamarMandi || 0,
                          },
                          { name: "LB", value: prop.buildingArea || 0 }, // <-- Diubah
                          { name: "LT", value: prop.landArea || 0 }, // <-- Diubah
                        ];

                        const propertyForCard: Property = {
                          id: prop.propertyId,
                          propertyName: prop.name,
                          developerId: cluster.developerId,
                          clusterId: cluster.id,
                          location: cluster.address || prop.location || "N/A",
                          developerName: cluster.developerName,
                          price: Number(prop.price) || 0,
                          facilities: rawFacilities.filter((f) => f.value > 0),
                          updatedAt: prop.updated_at,
                          photoUrl: prop.property_photo_urls?.[0] || null,
                        };
                        return (
                          <PropertyCard
                            key={`${type.id}-${prop.propertyId}`}
                            property={propertyForCard}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Fasilitas Bersama
            </h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {facilities.length > 0 ? (
                facilities.map((facility) => (
                  <div
                    key={facility.name}
                    className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"
                  >
                    <facility.icon />
                    <span className="ml-2 font-medium text-gray-700">
                      {facility.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Fasilitas tidak tersedia.</p>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi</h2>
            {areCoordinatesValid ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full h-96">
                  <MapLoader
                    center={[
                      Number(cluster.latitude),
                      Number(cluster.longitude),
                    ]}
                    popupText={`Lokasi ${cluster.name}`}
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Peta lokasi tidak tersedia.</p>
            )}
          </div>

          {/* Kolom Kanan (Sticky) */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-20">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <p className="text-sm text-teal-700">Harga mulai dari</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {`${formatPrice(cluster.minPrice)} - ${formatPrice(
                      cluster.maxPrice
                    )}`}
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-lg font-bold text-gray-900">
                    {cluster.developerName}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {cluster.address || "Alamat tidak tersedia"}
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-sm text-gray-500 mb-2">Developer:</p>
                  <div className="relative h-16">
                    <Image
                      src={
                        developer.developerPhotoUrl ||
                        "https://via.placeholder.com/150x50.png?text=Logo"
                      }
                      alt="Developer Logo"
                      layout="fill"
                      objectFit="contain"
                      objectPosition="left"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
