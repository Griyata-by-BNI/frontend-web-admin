import React from "react";
import Image from "next/image";
import Link from "next/link";
import { KPRSimulator } from "@/app/(debtor)/kpr-simulator/_components/KPRSimulator";
import { CTASection } from "@/app/(debtor)/kpr-information/detail/components/CTASection";
import { axiosInstance, axiosServer } from "@/utils/axios";
import HeroSearch from "@/app/(debtor)/developers/components/HeroSearch";
import RecentlyViewedProperties from "@/components/home/RecentlyViewedProperties";

// --- TYPE DEFINITION ---
interface Property {
  id: number;
  developerId: number;
  clusterId: number;
  clusterName: string;
  propertyName: string;
  location: string;
  price: string;
  photoUrl: string | null;
}

// --- API FETCHING ---
async function getLatestProperties(): Promise<Property[]> {
  try {
    const response = await axiosServer.get("/properties/explore", {
      params: {
        sortBy: "updatedAt",
        sortDir: "DESC",
        pageSize: 4,
      },
    });
    return response.data?.data?.properties || [];
  } catch (error) {
    console.error("Failed to fetch latest properties:", error);
    return [];
  }
}

// --- CHILD COMPONENT ---
const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
  <Link
    href={`/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.id}`}
    className="block bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg h-full"
  >
    <div className="relative w-full h-48 bg-gray-200">
      <Image
        src={
          property.photoUrl ||
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        }
        alt={property.propertyName}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-800 truncate">
        {property.propertyName}
      </h4>
      <p className="text-sm text-gray-500 mt-1">{property.location}</p>
      <p className="text-lg font-bold text-teal-600 mt-3">
        Rp {Number(property.price).toLocaleString("id-ID")}
      </p>
    </div>
  </Link>
);

interface RecentlyViewedProperty extends Property {
  lastViewed: string;
}

export default async function HomePage() {
  const latestProperties = await getLatestProperties();

  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-100 to-white pt-20 pb-10 text-center relative overflow-hidden">
        {/* ✨ FIX: Added `relative z-10` to ensure this content is on top */}
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Gunakan Cara Baru,
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-500 leading-tight mt-2">
            untuk Pindah ke Rumah Baru!
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Bersama BNI, wujudkan KPR dengan sentuhan jari.
          </p>
          <div className="text-center mb-12">
            <HeroSearch />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 opacity-20"></div>
      </section>

      {/* Main Content Section */}
      <div className="relative">
        <Image
          src="/images/home.png"
          alt="Content background shape"
          width={1920}
          height={150}
          className="w-full -mt-5"
        />
        <div className="container mx-auto px-4">
          {/* START AI AGENT */}
          {/* Agent Bot Griyata Introduction Section dengan Kombinasi Fitur */}
          <div className="mb-10">
            <div className="flex items-center bg-cyan-50 rounded-2xl shadow p-6 gap-4 relative">
              {/* Online Status Indicator dengan Animasi */}
              <div className="absolute top-4 right-4 flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-500">Online</span>
              </div>

              <div className="flex-shrink-0">
                <div className="relative">
                  <Image
                    src="/logo-griyata.png"
                    alt="Griyata Bot"
                    width={64}
                    height={64}
                    className="rounded-full border border-cyan-200 bg-white"
                  />
                  {/* Animated Pulse Effect */}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500"></span>
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-cyan-700 mb-1">
                  Hai, saya Griyata Bot!
                </h3>
                <p className="text-gray-700 mb-3">
                  Saya adalah asisten virtual Griyata yang siap membantu Anda
                  menemukan rumah impian, simulasi KPR, dan menjawab pertanyaan
                  seputar properti.
                  <br />
                  Jangan ragu untuk bertanya atau meminta bantuan kapan saja.
                  Saya siap membantu perjalanan properti Anda menjadi lebih
                  mudah dan menyenangkan!
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center">
                    <span className="mr-1">🏠</span> Cari Rumah
                  </button>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center">
                    <span className="mr-1">📊</span> Simulasi KPR
                  </button>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center">
                    <span className="mr-1">💬</span> Tanya Tips
                  </button>
                </div>

                {/* Contoh Pertanyaan */}
                <div className="bg-cyan-100 p-3 rounded-lg mt-2">
                  <h4 className="font-semibold text-cyan-800 mb-2 text-sm">
                    Coba tanyakan:
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">
                        "Rumah dengan 3 kamar di Jakarta Selatan dengan budget
                        2M"
                      </span>
                    </li>
                    <li className="flex">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">
                        "Simulasi KPR untuk rumah senilai 1.5M dengan DP 20%"
                      </span>
                    </li>
                    <li className="flex">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">
                        "Tips memilih rumah pertama untuk keluarga muda"
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* END AI AGENT */}

          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Cluster Terbaru
              </h3>
              <Link
                href="/explore"
                className="text-cyan-600 font-semibold hover:underline"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>

          {/* START SECTION TERAKHIR DILIHAT */}
          <RecentlyViewedProperties />
          {/* END SECTION TERAKHIR DILIHAT */}
        </div>
      </div>

      {/* Other Sections */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Simulasikan KPRmu!
            </h2>
            <p className="text-gray-500 mt-2">
              Transparansi Angsuran di Ujung Jari Anda
            </p>
            <div className="mt-8 max-w-5xl mx-auto">
              <KPRSimulator initialPropertyPrice={2400000000} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="text-center">
            <CTASection />
          </div>
        </div>
      </section>
    </div>
  );
}
