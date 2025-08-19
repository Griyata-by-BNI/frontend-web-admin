import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapLoader from "@/app/(debtor)/developers/components/Map";
import axiosInstance from "@/utils/axios";

// =================================================================
// 1. ICONS & HELPER FUNCTIONS
// =================================================================

const BedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"> <path d="M2 4v16h20V4Z" /> <path d="M2 10h20" /> </svg> );
const BuildingAreaIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"> <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" /> <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /> </svg> );
const MasjidIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M2 20v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" /> <path d="M12 2v12" /> <path d="M9 14h6" /> <path d="M12 18a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4z" /> </svg> );
const CommunityIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /> <path d="M23 21v-2a4 4 0 0 0-3-3.87" /> <path d="M16 3.13a4 4 0 0 1 0 7.75" /> </svg> );
const ParkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /> <path d="m12 11-3 3 4 2 3-3-4-2z" /> </svg> );
const GymIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m6 8 4 4-4 4" /> <path d="M18 8h-5" /> <path d="M18 12h-5" /> <path d="M18 16h-5" /> </svg> );
const LocationPinIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /> <circle cx="12" cy="10" r="3" /> </svg> );

const formatPrice = (priceString: string): string => {
    const price = Number(priceString);
    if (isNaN(price)) return "N/A";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1).replace(".0", "")} JT`;
    return price.toLocaleString("id-ID");
};

// =================================================================
// 2. API TYPE DEFINITIONS
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
    address: string;
    latitude: string;
    longitude: string;
    minPrice: string;
    maxPrice: string;
    facilities: string | null;
    cluster_photo_urls: string[];
    nearby_places?: { name: string; distance: number }[]; // Make array optional
}

interface ApiPropertyType {
    id: number;
    cluster_id: number;
    name: string;
    description: string;
}

interface ClusterPageData {
    cluster: ApiClusterDetail;
    propertyTypes: ApiPropertyType[];
    developer: ApiDeveloper;
}

// =================================================================
// 3. API FETCHING LOGIC
// =================================================================

async function getClusterPageData(developerId: string, clusterId: string): Promise<ClusterPageData | null> {
    try {
        const [clusterRes, typesRes, developerRes] = await Promise.all([
            axiosInstance.get<{ data: { clusters: ApiClusterDetail[] } }>(`/api/v1/clusters/${clusterId}`),
            axiosInstance.get<{ data: { clusterTypes: ApiPropertyType[] } }>(`/api/v1/clusters/type/cluster/${clusterId}`),
            axiosInstance.get<{ data: { developer: ApiDeveloper } }>(`/api/v1/developers/${developerId}`),
        ]);

        const clusterData = clusterRes.data.data.clusters[0];
        const propertyTypesData = typesRes.data.data.clusterTypes;
        const developerData = developerRes.data.data.developer;

        if (!clusterData || !developerData) return null;

        return {
            cluster: clusterData,
            propertyTypes: propertyTypesData,
            developer: developerData,
        };
    } catch (error) {
        console.error("Failed to fetch cluster page data:", error);
        return null;
    }
}

// =================================================================
// 4. CHILD COMPONENTS
// =================================================================

const PropertyTypeCard: React.FC<{
  property: ApiPropertyType;
  developerId: number;
  clusterId: number;
}> = ({ property, developerId, clusterId }) => (
  <Link
    href={`/developers/${developerId}/clusters/${clusterId}/properties/${property.id}`}
    className="block bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg p-4"
  >
    <h4 className="font-bold text-gray-800 text-lg">{property.name}</h4>
    <p className="text-gray-600 mt-2 text-sm">{property.description}</p>
  </Link>
);

// =================================================================
// 5. MAIN PAGE COMPONENT
// =================================================================

export default async function HousingDetailPage({ params }: { params: { developer_id: string, cluster_id: string } }) {
  const data = await getClusterPageData(params.developer_id, params.cluster_id);

  if (!data) {
    notFound();
  }
  
  const { cluster, propertyTypes, developer } = data;

  const facilityIconMap: { [key: string]: React.ComponentType } = {
      'masjid': MasjidIcon,
      'ruang komunitas': CommunityIcon,
      'taman': ParkIcon,
      'gym': GymIcon,
      'kolam renang': ParkIcon,
  };
  
  const facilities = (cluster.facilities || '')
    .split(',')
    .map(f => f.trim().toLowerCase())
    .map(name => ({ name: name.charAt(0).toUpperCase() + name.slice(1), icon: facilityIconMap[name] }))
    .filter(f => f.icon && f.name);

  return (
    <div className="bg-light-tosca min-h-screen">
      <main className="container">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{cluster.name}</h1>
            <div className="relative w-full h-100 rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={cluster.cluster_photo_urls?.[0] || "https://via.placeholder.com/1200x800.png?text=Cluster+Image"}
                alt={cluster.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{cluster.description}</p>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tipe Properti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {(propertyTypes || []).map((prop) => (
                <PropertyTypeCard
                  key={prop.id}
                  property={prop}
                  developerId={cluster.developerId}
                  clusterId={cluster.id}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fasilitas Bersama</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {facilities.map((facility) => (
                <div key={facility.name} className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <facility.icon />
                  <span className="ml-2 font-medium text-gray-700">{facility.name}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi dan Tempat Sekitar</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-96">
                <MapLoader
                  center={[Number(cluster.latitude), Number(cluster.longitude)]}
                  popupText={`Lokasi ${cluster.name}`}
                />
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                 {/* ✨ THIS IS THE FIX ✨ */}
                {(cluster.nearby_places || []).map((loc, index) => (
                  <div key={index} className="flex items-center">
                    <LocationPinIcon />
                    <span className="ml-3 text-gray-700">{loc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan (Sticky) */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <p className="text-sm text-teal-700">Harga mulai dari</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">
                    <span className="text-2xl align-top">Rp </span>
                    {`${formatPrice(cluster.minPrice)} - ${formatPrice(cluster.maxPrice)}`}
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-xl font-bold text-gray-900">{cluster.developerName}</p>
                  <p className="text-gray-500">{cluster.address}</p>
                  <div className="my-5 border-t"></div>
                  <p className="text-sm text-gray-500 mb-2">Developer:</p>
                  <Image
                    src={developer.developerPhotoUrl || "https://via.placeholder.com/150x50.png?text=Logo"}
                    alt="Developer Logo"
                    width={150}
                    height={50}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
