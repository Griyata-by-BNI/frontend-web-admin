import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { axiosServer } from "@/utils/axios";

// ✨ 1. Mengimpor komponen ClusterCard yang benar dari file terpisah
import ClusterCard from "@/app/(debtor)/developers/components/ClusterCard";
import ClusterSearchWrapper from "@/app/(debtor)/developers/components/ClusterSearchWrapper";

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
      axiosServer.get<{ data: { clusters: ApiCluster[] } }>(
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
            <ClusterSearchWrapper 
              clusters={developer.clusters} 
              developerName={developer.name}
              developerId={developer.id}
            />
          </section>
        )}
      </main>
    </div>
  );
}
