import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { KPRSimulator } from "@/app/(debtor)/kpr-simulator";
import MapLoader from "@/app/(debtor)/developers/components/Map";

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
}

interface ApiDeveloper {
  developerPhotoUrl: string;
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
    specs.push({ text: `Luas Tanah ${Number(landArea)} m²`, icon: faChartArea });
  }

  if (buildingArea) {
    specs.push({
      text: `Luas Bangunan ${Number(buildingArea)} m²`,
      icon: faHouse,
    });
  }

  return specs;
};

// This function calculates a sample installment
const calculateInstallment = (price: number): number => {
  // Simple estimation: 1% of the price
  return Math.round(price * 0.01);
};

// =================================================================
// 4. API FETCHING LOGIC
// =================================================================

async function getPropertyPageData(propertyId: string, developerId: string) {
  try {
    const [propertyRes, developerRes] = await Promise.all([
      axiosInstance.get<{ data: ApiPropertyDetail }>(
        `/api/v1/properties/${propertyId}`
      ),
      axiosInstance.get<{ data: { developer: ApiDeveloper } }>(
        `/api/v1/developers/${developerId}`
      ),
    ]);

    const property = propertyRes.data.data;
    const developer = developerRes.data.data.developer;

    if (!property || !developer) return null;

    // Process the raw API data to fit the UI
    const specifications = parseSpecifications(
      property.spesifications,
      property.landArea,
      property.buildingArea
    );
    const installment = calculateInstallment(Number(property.price));

    return {
      property,
      developer,
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
  params: { property_id: string; developer_id: string };
}) {
  const data = await getPropertyPageData(params.property_id, params.developer_id);

  if (!data) {
    notFound();
  }

  const { property, developer, processed } = data;

  return (
    <div className="bg-light-tosca min-h-screen font-sans">
      <main className="container">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {property.name}
            </h1>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={
                  property.property_photo_urls?.[0] ||
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
                }
                alt={property.name}
                layout="fill"
                objectFit="cover"
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

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-96">
                <MapLoader
                  center={[
                    Number(property.latitude),
                    Number(property.longitude),
                  ]}
                  popupText={`Lokasi ${property.name}`}
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <p className="text-sm text-teal-700">Harga</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">
                    <span className="text-2xl align-top">Rp </span>
                    {new Intl.NumberFormat("id-ID").format(
                      Number(property.price)
                    )}
                  </p>
                  <p className="text-teal-600 font-semibold mt-2">
                    Angsuran Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      processed.installment
                    )}
                    /bulan
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-xl font-bold text-gray-900">
                    {property.developerName}
                  </p>
                  <p className="text-gray-500">{property.location}</p>
                  <div className="my-5 border-t"></div>
                  <p className="text-sm text-gray-500 mb-2">Developer:</p>
                  <Image
                    src={
                      developer.developerPhotoUrl ||
                      "https://via.placeholder.com/150x50.png?text=Logo"
                    }
                    alt="Developer Logo"
                    width={150}
                    height={50}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              </div>
              <div className="px-6 py-4">
                <button className="w-full bg-teal-500 text-white font-bold py-3 rounded-full mt-2 hover:bg-teal-600 transition-colors text-lg shadow-md">
                  Ajukan KPR
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}