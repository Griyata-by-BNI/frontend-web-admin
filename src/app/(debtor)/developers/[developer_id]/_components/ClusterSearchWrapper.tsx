"use client";

import { useState, useMemo } from "react";
import { useClustersByDeveloper } from "@/services/clusterServices";
import ClusterCard from "../../_components/ClusterCard";
import { Building2 } from "lucide-react";

interface ClusterSearchWrapperProps {
  developerName: string;
  developerId: number;
}

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

export default function ClusterSearchWrapper({
  developerName,
  developerId,
}: ClusterSearchWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clustersData, isLoading } = useClustersByDeveloper(
    developerId.toString()
  );

  const allClusters = clustersData?.data?.clusters || [];

  const clusters = useMemo(() => {
    if (!searchTerm.trim()) return allClusters;

    return allClusters.filter(
      (cluster) =>
        cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allClusters, searchTerm]);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-8 h-8 text-teal-600" />

          <h2 className="text-2xl font-bold text-gray-800">
            Jelajahi Cluster Perumahan dari {developerName}
          </h2>
        </div>

        <div className="relative w-full sm:w-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Cari Cluster"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Memuat...</p>
        </div>
      ) : clusters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              developerId={developerId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">
            {searchTerm.trim()
              ? "Tidak ada properti yang ditemukan."
              : "Tidak ada properti yang ditemukan untuk developer ini."}
          </p>
        </div>
      )}
    </>
  );
}
