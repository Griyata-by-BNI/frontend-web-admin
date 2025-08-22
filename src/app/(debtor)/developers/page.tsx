import ClusterCard from "@/app/(debtor)/developers/components/ClusterCard";
import DeveloperSearchWrapper from "@/app/(debtor)/developers/components/DeveloperSearchWrapper";
import { axiosServer } from "@/utils/axios";
import Image from "next/image";
import Link from "next/link";
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
// 3. API FETCHING LOGIC (Tidak ada perubahan)
// =================================================================
const getDevelopersWithClusters = async (): Promise<
  DeveloperWithClusters[]
> => {
  try {
    const developerResponse = await axiosServer.get<{
      data: { developers: ApiDeveloper[] };
    }>(`/developers`);
    const developers = developerResponse.data.data.developers;

    if (!developers || developers.length === 0) return [];

    const detailedDataPromises = developers.map(async (developer) => {
      try {
        const summaryClustersRes = await axiosServer.get<{
          data: { clusters: ApiCluster[] };
        }>(`/clusters/developer/${developer.id}`);

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
      <DeveloperSearchWrapper developers={developers} />
    </main>
  );
}
