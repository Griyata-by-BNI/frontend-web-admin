import React from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axios";

// =================================================================
// 1. UPDATED TYPE DEFINITIONS
// These now perfectly match your API payloads.
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
  address: string; // Changed from 'location'
  minPrice: string;
  maxPrice: string;
  cluster_photo_urls: string[]; // This is an array of strings
  // We can add other fields like 'description' if needed on the card
}

interface DeveloperWithClusters extends ApiDeveloper {
  clusters: ApiCluster[];
}

// =================================================================
// 2. HELPER COMPONENTS & FUNCTIONS
// =================================================================

// A helper function to format large numbers into a more readable format (e.g., "1 Miliar", "800 Juta")
const formatPrice = (priceString: string): string => {
  const price = Number(priceString);
  if (isNaN(price)) return "N/A";
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1).replace(".0", "")} Miliar`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1).replace(".0", "")} Juta`;
  }
  return price.toLocaleString("id-ID");
};

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
);


// REWRITTEN ClusterCard component to match your API data
interface ClusterCardProps {
  cluster: ApiCluster;
  developerId: number;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, developerId }) => {
  const href = `/developers/${developerId}/clusters/${cluster.id}`;
  
  // Use the first photo from the array, or a placeholder if the array is empty
  const imageUrl = cluster.cluster_photo_urls?.[0] || "https://via.placeholder.com/600x400.png?text=Property+Image";

  return (
    <Link href={href} className="flex">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col w-full">
        <div className="relative w-full h-48">
          <Image src={imageUrl} alt={cluster.name} layout="fill" objectFit="cover" />
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-teal-700">{cluster.name}</h3>
          <p className="text-base text-teal-600/90 mt-1 mb-5">{cluster.address}</p>
          <div className="mt-auto border-t pt-4">
            <p className="text-xs text-gray-500">Harga mulai dari</p>
            <p className="text-lg font-bold text-gray-800">
              <span className="font-normal text-sm">Rp</span> {formatPrice(cluster.minPrice)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};


// =================================================================
// 3. NEW & EFFICIENT API FETCHING LOGIC
// =================================================================
const getDeveloperDetails = async (id: string): Promise<DeveloperWithClusters | null> => {
  
  try {
    // Step 1: Fetch the specific developer's details
    const developerRes = await axiosInstance.get<{ data: { developer: ApiDeveloper } }>(
        `/api/v1/developers/${id}`
    );
    const developer = developerRes.data.data.developer;

    // Step 2: Fetch only the clusters for that developer using the efficient endpoint
    const clustersRes = await axiosInstance.get<{ data: { clusters: ApiCluster[] } }>(
        `/api/v1/clusters/developer/${id}`
    );
    const clusters = clustersRes.data.data.clusters;

    // Step 3: Combine and return
    return { ...developer, clusters: clusters };

  } catch (error) {
    console.error(`Failed to fetch details for developer ${id}:`, error);
    return null;
  }
};


// =================================================================
// 4. MAIN PAGE COMPONENT
// =================================================================
export default async function DeveloperDetailPage({ params }: { params: { developer_id: string } }) {
  const developer = await getDeveloperDetails(params.developer_id);

  if (!developer) {
    notFound();
  }
  
  const logoUrl = developer.developerPhotoUrl || "https://via.placeholder.com/250x125.png?text=Developer+Logo";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <main className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{developer.name}</h1>

        {/* About Developer Section */}
        <section className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex justify-center items-center">
              <Image src={logoUrl} alt={`${developer.name} logo`} width={250} height={125} className="object-contain" />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang {developer.name}</h2>
              <p className="text-gray-600 leading-relaxed">{developer.description}</p>
            </div>
          </div>
        </section>

        {/* Explore Properties Section */}
        <section className="mt-12">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Jelajahi Properti dari {developer.name}</h2>
            <div className="relative w-full sm:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                <input type="text" placeholder="Cari Cluster" className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          
          {developer.clusters && developer.clusters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {developer.clusters.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} developerId={developer.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Tidak ada properti yang ditemukan untuk developer ini.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

