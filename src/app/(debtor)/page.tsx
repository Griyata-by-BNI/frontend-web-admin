import React from "react";
import Image from "next/image";
import Link from "next/link";
import { KPRSimulator } from "@/app/(debtor)/kpr-simulator/_components/KPRSimulator";
import { CTASection } from "@/app/(debtor)/kpr-information/detail/components/CTASection";
import { axiosInstance, axiosServer } from "@/utils/axios";
import HeroSearch from "@/app/(debtor)/developers/components/HeroSearch";
import RecentlyViewedProperties from "@/components/home/RecentlyViewedProperties";
import ClusterCard from "@/app/(debtor)/developers/components/ClusterCard";

// --- TYPE DEFINITION ---
interface Cluster {
  id: number;
  maxPrice: string | null;
  minPrice: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  cluster_photo_urls: string[];
}

// --- API FETCHING ---
async function getLatestClusters(): Promise<Cluster[]> {
  try {
    const response = await axiosServer.get("/clusters/latest/clusters");
    return response.data?.data?.clusters || [];
  } catch (error) {
    console.error("Failed to fetch latest clusters:", error);
    return [];
  }
}





export default async function HomePage() {
  const latestClusters = await getLatestClusters();

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
            <div className="flex gap-4 max-w-full overflow-x-auto overflow-y-hidden pb-4">
              {latestClusters.map((cluster) => (
                <div key={cluster.id} className="flex-shrink-0 w-80">
                  <ClusterCard cluster={{...cluster, developerId: 1}} developerId={1} />
                </div>
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
