import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { axiosInstance, axiosServer } from "@/utils/axios";

// ✨ 1. Mengimpor komponen ClusterCard yang benar dari file terpisah
import ClusterCard from "@/app/(debtor)/developers/components/ClusterCard";

// =================================================================
// 2. TYPE DEFINITIONS
// =================================================================
interface ApiDeveloper {
  id: number;
  name: string;
  description: string;
  developerPhotoUrl: string;
}
interface ApiCluster {
  id: number;
  developerId: number;
  name: string;
  address: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  cluster_photo_urls: string[];
}
interface DeveloperWithClusters extends ApiDeveloper {
  clusters: ApiCluster[];
}

// =================================================================
// 3. HELPER COMPONENTS & FUNCTIONS
// =================================================================
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// ✨ Kode ClusterCard versi lama sudah DIHAPUS dari sini.

// =================================================================
// 4. DATA FETCHING LOGIC
// =================================================================
const getDeveloperDetails = async (
  id: string
): Promise<DeveloperWithClusters | null> => {
  try {
    const developerRes = await axiosServer.get<{
      data: { developer: ApiDeveloper };
    }>(`/developers/${id}`);
    const developer = developerRes.data.data.developer;
    const summaryClustersRes = await axiosServer.get<{
      data: { clusters: ApiCluster[] };
    }>(`/clusters/developer/${id}`);
    const summaryClusters = summaryClustersRes.data.data.clusters;
    if (!summaryClusters || summaryClusters.length === 0) {
      return { ...developer, clusters: [] };
    }
    const clusterDetailPromises = summaryClusters.map((cluster) =>
      axiosInstance.get<{ data: { clusters: ApiCluster[] } }>(
        `/clusters/${cluster.id}`
      )
    );
    const clusterDetailResults = await Promise.allSettled(
      clusterDetailPromises
    );
    const detailedClusters = clusterDetailResults
      .filter(
        (result) =>
          result.status === "fulfilled" &&
          result.value.data?.data?.clusters?.[0]
      )
      .map(
        (result) =>
          (result as PromiseFulfilledResult<any>).value.data.data.clusters[0]
      );
    return { ...developer, clusters: detailedClusters };
  } catch (error) {
    console.error(`Failed to fetch details for developer ${id}:`, error);
    return null;
  }
};

// =================================================================
// 5. MAIN PAGE COMPONENT
// =================================================================
export default async function DeveloperDetailPage({
  params,
}: {
  params: { developer_id: string };
}) {
  const developer = await getDeveloperDetails(params.developer_id);

  if (!developer) {
    notFound();
  }
  const logoUrl =
    developer.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Developer+Logo";

  return (
    <div className="bg-gradient-to-t from-white to-light-tosca min-h-screen">
      <main className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {developer.name}
        </h1>
        <section className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex justify-center items-center">
              <Image
                src={logoUrl}
                alt={`${developer.name} logo`}
                width={250}
                height={125}
                className="object-contain"
              />
            </div>

            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tentang {developer.name}
              </h2>

              <p className="text-gray-600 leading-relaxed">
                {developer.description}
              </p>
            </div>
          </div>
        </section>

        {developer && (
          <section className="mt-12">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              {/* This is now safe to access */}
              <h2 className="text-2xl font-bold text-gray-800">
                Jelajahi Properti dari {developer.name}
              </h2>
              <div className="relative w-full sm:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Cari Cluster"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* This logic remains the same but is now safely nested */}
            {developer.clusters && developer.clusters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developer.clusters.map((cluster) => (
                  <ClusterCard
                    key={cluster.id}
                    cluster={cluster}
                    developerId={developer.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">
                  Tidak ada properti yang ditemukan untuk developer ini.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
