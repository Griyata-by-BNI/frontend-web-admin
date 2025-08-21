import React from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import ClusterCard from "@/app/(debtor)/developers/components/ClusterCard";
// =================================================================
// 1. TYPE DEFINITIONS (DISESUAIKAN DENGAN PAYLOAD)
// =================================================================

// ✨ Interface ini sekarang cocok dengan struktur data dari API Anda
interface ApiDeveloper {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  developerPhotoUrl: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiCluster {
  id: number;
  developerId: number;
  name: string;
  address: string | null;
  minPrice: string | null;
  cluster_photo_urls: string[];
}

interface DeveloperWithClusters extends ApiDeveloper {
  clusters: ApiCluster[];
}

// =================================================================
// 2. HELPER COMPONENTS & FUNCTIONS (Tidak ada perubahan)
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

// =================================================================
// 3. API FETCHING LOGIC (Tidak ada perubahan)
// =================================================================
const getDevelopersWithClusters = async (): Promise<
  DeveloperWithClusters[]
> => {
  try {
    const developerResponse = await axiosInstance.get<{
      data: { developers: ApiDeveloper[] };
    }>(`/api/v1/developers`);
    const developers = developerResponse.data.data.developers;

    if (!developers || developers.length === 0) return [];

    const detailedDataPromises = developers.map(async (developer) => {
      try {
        const summaryClustersRes = await axiosInstance.get<{
          data: { clusters: ApiCluster[] };
        }>(`/api/v1/clusters/developer/${developer.id}`);

        const summaryClusters = summaryClustersRes.data.data.clusters;

        if (!summaryClusters || summaryClusters.length === 0) {
          return { ...developer, clusters: [] };
        }

        return { ...developer, clusters: summaryClusters };
      } catch (error) {
        console.error(
          `Failed to fetch clusters for developer ${developer.id}:`,
          error
        );
        return { ...developer, clusters: [] }; // Return the developer with no clusters
      }
    });

    return await Promise.all(detailedDataPromises);
  } catch (error) {
    console.error("Failed to fetch initial list of developers:", error);
    return [];
  }
};
// =================================================================
// 4. MAIN PAGE COMPONENT (Tidak ada perubahan)
// =================================================================
export default async function PartnerDeveloperPage() {
  const developers = await getDevelopersWithClusters();

  return (
    <main className="container p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Partner Developer
          </h1>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari Developer"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {developers.length > 0 ? (
          developers.map((dev) => {
            const logoUrl =
              dev.developerPhotoUrl ||
              `https://via.placeholder.com/120x60.png?text=${dev.name.replace(
                /\s/g,
                "+"
              )}`;

            return (
              <section key={dev.id}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={logoUrl}
                      alt={`${dev.name} logo`}
                      width={100}
                      height={50}
                      className="object-contain rounded-md bg-white p-1 shadow-sm"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">
                      {dev.name}
                    </h2>
                  </div>

                  <Link
                    href={`/developers/${dev.id}`}
                    className="text-teal-600 font-semibold hover:underline flex-shrink-0"
                  >
                    Lihat lebih lengkap
                  </Link>
                </div>

                <p className="text-gray-600 mb-6 max-w-4xl">
                  {dev.description}
                </p>

                {dev.clusters && dev.clusters.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dev.clusters.slice(0, 3).map((cluster) => (
                      <ClusterCard
                        key={cluster.id}
                        cluster={cluster}
                        developerId={dev.id}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Could not load developers or none are available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
