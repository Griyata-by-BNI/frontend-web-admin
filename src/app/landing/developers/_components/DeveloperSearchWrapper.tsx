"use client";

import { useGetDevelopers } from "@/services/developerServices";
import { useDebounce } from "@/utils/useDebounce";
import { useState } from "react";
import DeveloperSection from "./DeveloperSection";
import DeveloperSectionSkeleton from "./DeveloperSectionSkeleton";
import { Search } from "lucide-react";

export default function DeveloperSearchWrapper() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: developersData, isLoading } = useGetDevelopers(
    undefined,
    undefined,
    debouncedSearchTerm || undefined
  );

  const developers = developersData?.data?.developers || [];

  return (
    <>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((item, index) => (
              <DeveloperSectionSkeleton key={index} />
            ))}
          </>
        ) : developers.length > 0 ? (
          developers.map((dev: any) => (
            <DeveloperSection key={dev.id} developer={dev} />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No developers found.</p>
          </div>
        )}
      </div>
    </>
  );
}
