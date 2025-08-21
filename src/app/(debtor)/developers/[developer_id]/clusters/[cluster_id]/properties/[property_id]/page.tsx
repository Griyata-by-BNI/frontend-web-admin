import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { axiosInstance, axiosServer } from "@/utils/axios";
import { KPRSimulator } from "@/app/(debtor)/kpr-simulator";
import MapLoader, {
  MapWithNearbyPlaces,
} from "@/app/(debtor)/developers/components/Map";
import StickyCard from "@/app/(debtor)/developers/components/StickyCard";
import ImageSlider from "@/app/(debtor)/developers/components/ImageSlider";

// 1. Import Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// ✨ Import the IconDefinition type
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBed,
  faShower,
  faHouse,
  faChartArea,
  faRulerCombined,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// =================================================================
// 2. API & LOCAL TYPE DEFINITIONS
// =================================================================

interface ApiPropertyDetail {
  id: number;
  developerId: number;
  developerName: string;
  name: string;
  description: string;
  price: string;
  location: string;
  latitude: string;
  longitude: string;
  stock: number;
  spesifications: string;
  landArea: string;
  buildingArea: string;
  property_photo_urls: string[];
  clusterTypeName?: string;
}

interface ApiDeveloper {
  developerPhotoUrl: string;
}

interface ApiCluster {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  nearbyPlaces?: {
    type: string;
    places: {
      name: string;
      distance: number;
    }[];
  }[];
}

// ✨ Define the type for a single specification item
interface Specification {
  text: string;
  icon: IconDefinition;
}

// =================================================================
// 3. HELPER FUNCTIONS for Data Processing
// =================================================================

// ✨ This function now has an explicit return type
const parseSpecifications = (
  specString: string,
  landArea: string,
  buildingArea: string
): Specification[] => {
  // ✨ Explicitly type the 'specs' array
  const specs: Specification[] = [];
  if (!specString) return specs;

  const kamarTidurMatch = specString.match(/(\d+)\s*kamar tidur/i);
  if (kamarTidurMatch) {
    specs.push({ text: `${kamarTidurMatch[1]} Kamar Tidur`, icon: faBed });
  }

  const kamarMandiMatch = specString.match(/(\d+)\s*kamar mandi/i);
  if (kamarMandiMatch) {
    specs.push({ text: `${kamarMandiMatch[1]} Kamar Mandi`, icon: faShower });
  }

  if (landArea) {
    specs.push({
      text: `Luas Tanah ${Number(landArea)} m²`,
      icon: faChartArea,
    });
  }

  if (buildingArea) {
    specs.push({
      text: `Luas Bangunan ${Number(buildingArea)} m²`,
      icon: faHouse,
    });
  }

  return specs;
};

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

const calculateInstallment = (
  price?: string | null,
  tenor: number = 180,
  dpPercent: number = 10,
  annualInterest: number = 3.25
) => {
  if (!price) return "N/A";
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum === 0) return "-";

  const dp = priceNum * (dpPercent / 100);
  const loanPrincipal = priceNum - dp;
  const monthlyInterest = annualInterest / 12 / 100;

  const n = tenor;
  const r = monthlyInterest;

  const installment = loanPrincipal * (r / (1 - Math.pow(1 + r, -n)));

  if (installment >= 1_000_000) {
    const million = installment / 1_000_000;
    return (
      "Rp " +
      (million % 1 === 0 ? `${million}` : `${million.toFixed(1)}`) +
      " JT"
    );
  } else if (installment >= 1_000) {
    const thousand = installment / 1_000;
    return (
      "Rp " +
      (thousand % 1 === 0 ? `${thousand}` : `${thousand.toFixed(1)}`) +
      " RB"
    );
  }
  return "Rp " + Math.round(installment).toLocaleString("id-ID");
};

// =================================================================
// 4. API FETCHING LOGIC
// =================================================================

async function getPropertyPageData(
  propertyId: string,
  developerId: string,
  clusterId: string
) {
  try {
    const [propertyRes, developerRes, clusterRes] = await Promise.all([
      axiosServer.get<{ data: ApiPropertyDetail }>(`/properties/${propertyId}`),
      axiosServer.get<{ data: { developer: ApiDeveloper } }>(
        `/developers/${developerId}`
      ),
      axiosServer.get<{ data: { clusters: ApiCluster[] } }>(
        `/clusters/${clusterId}`
      ),
    ]);

    const property = propertyRes.data.data;
    const developer = developerRes.data.data.developer;
    const cluster = clusterRes.data.data.clusters[0];

    if (!property || !developer || !cluster) return null;

    // Process the raw API data to fit the UI
    const specifications = parseSpecifications(
      property.spesifications,
      property.landArea,
      property.buildingArea
    );
    const installment = calculateInstallment(property.price);

    return {
      property,
      developer,
      cluster,
      processed: {
        specifications,
        installment,
      },
    };
  } catch (error) {
    console.error("Failed to fetch property page data:", error);
    return null;
  }
}

// =================================================================
// 5. MAIN PAGE COMPONENT
// =================================================================

export default async function PropertyDetailPage({
  params,
}: {
  params: { property_id: string; developer_id: string; cluster_id: string };
}) {
  const data = await getPropertyPageData(
    params.property_id,
    params.developer_id,
    params.cluster_id
  );

  if (!data) {
    notFound();
  }

  const { property, developer, cluster, processed } = data;

  const areCoordinatesValid =
    cluster.latitude &&
    cluster.longitude &&
    !isNaN(Number(cluster.latitude)) &&
    !isNaN(Number(cluster.longitude));

  return (
    <div className="bg-gradient-to-t from-white to-light-tosca min-h-screen py-8">
      <main className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {property.clusterTypeName
                ? `${property.clusterTypeName} - ${property.name}`
                : property.name}
            </h1>
            <div className="relative w-full h-96 lg:h-[350px] mb-6">
              <ImageSlider
                urls={property.property_photo_urls}
                altText={property.name}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {property.description}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Spesifikasi
            </h2>
            <div className="bg-white/70 border-2 border-teal-200 rounded-2xl p-6 mb-8 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {processed.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    <FontAwesomeIcon
                      icon={spec.icon}
                      className="text-teal-600 w-6 h-6"
                    />
                    <span className="ml-4 text-gray-800 font-medium">
                      {spec.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Simulasi KPR
            </h2>
            <div className="mb-8">
              <KPRSimulator initialPropertyPrice={Number(property.price)} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Lokasi & Tempat Terdekat
            </h2>
            {areCoordinatesValid ? (
              <MapWithNearbyPlaces
                center={[Number(cluster.latitude), Number(cluster.longitude)]}
                popupText={`Lokasi ${cluster.name}`}
                nearbyPlaces={cluster.nearbyPlaces || []}
              />
            ) : (
              <p className="text-gray-500">Peta lokasi tidak tersedia.</p>
            )}
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <StickyCard
              priceLabel="Harga"
              price={`Rp ${new Intl.NumberFormat("id-ID").format(
                Number(property.price)
              )}`}
              installmentText={`Angsuran mulai dari ${processed.installment}/bulan`}
              developerName={property.developerName}
              location={property.location}
              developerPhotoUrl={developer.developerPhotoUrl}
              stock={property.stock}
            />
            <Link href="/kpr-apply">
              <button className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
                Ajukan KPR
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
