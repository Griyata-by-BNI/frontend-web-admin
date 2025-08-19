import React from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import axiosInstance from "@/lib/axios";

// =================================================================
// 1. TYPE DEFINITIONS
// =================================================================

interface ApiDeveloper {
  id: number;
  name: string;
  description: string;
  developerPhotoUrl: string;
}

// Assuming the structure of a cluster from your API
interface ApiCluster {
  id: number;
  developerId: number; // The crucial link to the developer
  name: string;
  location: string;
  imageUrl: string; // Assuming the API provides an image URL
  price: string;    // Assuming price and installment are strings like "2.1 M"
  installment: string;
}

// A new combined type for our page's data
interface DeveloperWithClusters extends ApiDeveloper {
  clusters: ApiCluster[];
}

// =================================================================
// 2. HELPER/CHILD COMPONENTS
// =================================================================

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

interface ClusterCardProps {
  cluster: ApiCluster;
  developerId: number;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, developerId }) => {
  // Link to a specific property page, assuming cluster ID is used in the URL
  const href = `/developers/${developerId}/clusters/${cluster.id}`;

  return (
    <Link href={href} className="flex">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col w-full">
        <div className="relative w-full h-48">
          <Image
            src={cluster.imageUrl || "/placeholder.jpg"} // Fallback image
            alt={cluster.name}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-teal-700">{cluster.name}</h3>
          <p className="text-base text-teal-600/90 mt-1 mb-5">
            {cluster.location}
          </p>

          <div className="mt-auto grid grid-cols-2 items-center gap-4 border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Harga mulai dari</p>
              <p className="text-lg font-bold text-gray-800">
                <span className="font-normal text-sm">Rp</span> {cluster.price}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Angsuran mulai dari</p>
              <p className="text-lg font-bold text-gray-800">
                <span className="font-normal text-sm">Rp</span> {cluster.installment}
                <span className="text-xs text-gray-500 font-normal"> /bulan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// =================================================================
// 3. API FETCHING & DATA MERGING
// =================================================================

const getDevelopersWithClusters = async (): Promise<DeveloperWithClusters[]> => {
  
  try {
    // Step 1: Fetch developers and clusters concurrently
    const [developerResponse, clusterResponse] = await Promise.all([
      axiosInstance.get<{ data: { developers: ApiDeveloper[] } }>(`/api/v1/developers`),
      axiosInstance.get<{ data: { clusters: ApiCluster[] } }>(`/api/v1/clusters`) // Assuming this structure
    ]);

    const developers = developerResponse.data.data.developers;
    const allClusters = clusterResponse.data.data.clusters;

    // Step 2: Merge the data
    const developersWithClusters = developers.map(developer => {
      // For each developer, find their clusters
      const matchingClusters = allClusters.filter(cluster => cluster.developerId === developer.id);
      return {
        ...developer,
        clusters: matchingClusters,
      };
    });

    return developersWithClusters;

  } catch (error) {
    console.error("Failed to fetch data:", error);
    return []; // Return empty array on error
  }
};

// =================================================================
// 4. MAIN PAGE COMPONENT
// =================================================================

const PartnerDeveloperPage = async () => {
  const developers = await getDevelopersWithClusters();

  return (
    <main className="container p-4 md:p-8">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Developer</h1>
        </div>
        <div className="relative w-full md:w-auto">
          <input type="text" placeholder="Cari Developer" className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Developers List */}
      <div className="space-y-12">
        {developers.length > 0 ? (
          developers.map((dev) => (
            <section key={dev.id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{dev.name}</h2>
                <Link href={`/developers/${dev.id}`} className="text-teal-600 font-semibold hover:underline flex-shrink-0">
                  Lihat lebih lengkap
                </Link>
              </div>
              <p className="text-gray-600 mb-6 max-w-4xl">{dev.description}</p>
              
              {/* Grid of Clusters */}
              {dev.clusters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dev.clusters.slice(0, 3).map((cluster) => ( // Show first 3 clusters
                    <ClusterCard key={cluster.id} cluster={cluster} developerId={dev.id} />
                  ))}
                </div>
              )}
            </section>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Could not load developers or none are available.</p>
          </div>
        )}
      </div>
    </main>
  );
};
export default PartnerDeveloperPage;

