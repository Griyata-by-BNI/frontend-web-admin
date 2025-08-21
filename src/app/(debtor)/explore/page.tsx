"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
// Hapus Link jika tidak digunakan lagi di sini
import { useSearchParams } from "next/navigation";
import axios from "axios";
import FilterPopup, { FilterState } from "./components/FilterPopup";
import PropertyCard from "@/app/(debtor)/developers/components/PropertyCard";
import { axiosServer } from "@/utils/axios";

export interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

export interface Property {
  id: number;
  developerId: number;
  clusterId: number;
  location: string;
  propertyName: string;
  developerName: string;
  price: number;
  installment?: number;
  facilities: Facility[];
  updatedAt: string;
  photoUrl: string | null;
  distanceKm?: number;
  clusterTypeName?: string;
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4h18M3 10h12M3 16h6" />
  </svg>
);
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const HeroSearchBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  onFilterClick: () => void;
}> = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  onFilterClick,
}) => (
  <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl max-w-5xl mx-auto border border-white/20">
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      <div className="flex-grow w-full flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all duration-300">
        <div className="pl-4 text-gray-400 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Cari nama properti, developer, atau lokasi..."
          className="w-full pr-4 py-3 pl-3 border-none focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full lg:w-auto flex-shrink-0 flex gap-3">
        <div className="relative w-full lg:w-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <SortIcon />
          </div>
          <select
            className="w-full lg:w-52 appearance-none pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-700 hover:border-teal-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base font-medium"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latestUpdated">Urutkan: Terbaru</option>
            <option value="highestPrice">Harga Tertinggi</option>
            <option value="lowestPrice">Harga Terendah</option>
            <option value="closestDistance">Jarak Terdekat</option>
          </select>
        </div>
        <button
          onClick={onFilterClick}
          className="w-full lg:w-auto px-6 py-3 flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
        >
          <FilterIcon />
          <span>Filter</span>
        </button>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl shadow-lg p-5 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
    <div className="space-y-3">
      <div className="h-5 w-4/5 bg-gray-200 rounded-xl"></div>
      <div className="h-4 w-3/5 bg-gray-200 rounded-xl"></div>
      <div className="h-5 w-2/3 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="my-4 border-t border-gray-200 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-4 bg-gray-200 rounded-xl"></div>
        <div className="h-4 bg-gray-200 rounded-xl"></div>
        <div className="h-4 bg-gray-200 rounded-xl"></div>
        <div className="h-4 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// --- KOMPONEN HALAMAN UTAMA ---
export default function ExplorePage() {
  // ... semua state (useState) tetap sama ...
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latestUpdated");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // ... semua hooks (useSearchParams, useEffect, useCallback) tetap sama ...
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search");
    const maxPrice = searchParams.get("maxPrice");

    if (query) {
      setSearchTerm(query);
    }

    if (maxPrice) {
      const priceValue = parseInt(maxPrice);
      if (!isNaN(priceValue)) {
        setAppliedFilters({
          price: { min: 0, max: priceValue },
          bedrooms: 0,
          bathrooms: 0,
          floors: 0,
          landArea: { min: 0, max: 500 },
          buildingArea: { min: 0, max: 500 },
        });
      }
    }
  }, [searchParams]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location obtained:", userCoords);
          setUserLocation(userCoords);
          setLocationLoading(false);
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLocationLoading(false);
          setSortOption("updatedAt");
          setError(
            "Akses lokasi diperlukan untuk mengurutkan berdasarkan jarak. Silakan izinkan akses lokasi dan coba lagi."
          );
        }
      );
    } else {
      alert(
        "Browser Anda tidak mendukung fitur geolocation. Silakan gunakan browser yang lebih modern."
      );
      setSortOption("updatedAt");
    }
  };

  const handleSortChange = (newSortOption: string) => {
    if (newSortOption === "closestDistance" && !userLocation) {
      requestLocation();
    }
    setSortOption(newSortOption);
  };

  const fetchProperties = useCallback(
    async (
      currentSearchTerm: string,
      currentSortOption: string,
      currentFilters: FilterState | null
    ) => {
      // Don't fetch if distance sort is selected but location is not available
      if (currentSortOption === "closestDistance" && !userLocation) {
        if (!locationLoading) {
          setError(
            "Mohon izinkan akses lokasi untuk mengurutkan properti berdasarkan jarak terdekat."
          );
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params: any = {
          search: currentSearchTerm,
        };

        params.sortBy = currentSortOption;

        if (currentSortOption === "closestDistance" && userLocation) {
          params.userLat = userLocation.lat;
          params.userLng = userLocation.lng;
        }
        if (currentFilters) {
          if (currentFilters.price.min > 0)
            params.kisaranHargaMin = currentFilters.price.min;
          if (currentFilters.price.max < 10000000000)
            params.kisaranHargaMax = currentFilters.price.max;
          if (currentFilters.bedrooms > 0)
            params.jumlahKamarTidur = currentFilters.bedrooms;
          if (currentFilters.bathrooms > 0)
            params.jumlahKamarMandi = currentFilters.bathrooms;
          if (currentFilters.floors > 0)
            params.jumlahLantai = currentFilters.floors;
          if (currentFilters.landArea.min > 0)
            params.luasTanahMin = currentFilters.landArea.min;
          if (currentFilters.landArea.max < 500)
            params.luasTanahMax = currentFilters.landArea.max;
          if (currentFilters.buildingArea.min > 0)
            params.luasBangunanMin = currentFilters.buildingArea.min;
          if (currentFilters.buildingArea.max < 500)
            params.luasBangunanMax = currentFilters.buildingArea.max;

        }
        const response = await axiosServer.get(`/properties/explore`, {
          params,
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const result = response.data;
        if (result.data && Array.isArray(result.data.properties)) {
          setProperties(result.data.properties);
          setTotalItems(result.pagination?.itemsTotal || 0);
        } else {
          throw new Error("Struktur data dari API tidak sesuai");
        }
      } catch (err: any) {
        console.error("Gagal mengambil data properti:", err);
        if (axios.isAxiosError(err))
          setError(
            err.response?.data?.status?.message || "Gagal menghubungi server."
          );
        else setError(err.message || "Terjadi kesalahan.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [userLocation]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProperties(searchTerm, sortOption, appliedFilters);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, sortOption, appliedFilters, fetchProperties]);

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setFilterOpen(false);
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    if (error)
      return (
        <div className="col-span-full text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-red-700 text-base">{error}</p>
          </div>
        </div>
      );
    if (properties.length === 0)
      return (
        <div className="col-span-full text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Tidak Ada Properti Ditemukan
            </h3>
            <p className="text-gray-500 text-base">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
          </div>
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-t from-white to-light-tosca font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop"
          alt="Modern luxury homes background"
          layout="fill"
          objectFit="cover"
          className="z-0 rounded-b-3xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-cyan-900/80 rounded-b-3xl"></div>
        <div className="relative z-10 w-full px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Jelajahi Properti
            </h1>
            <p className="text-lg lg:text-xl text-teal-100 font-light">
              Temukan rumah impian Anda dengan mudah
            </p>
          </div>
          <HeroSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={handleSortChange}
            onFilterClick={() => setFilterOpen(true)}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-2 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {loading || locationLoading
                ? "Mencari..."
                : `${totalItems} Properti Tersedia`}
            </h2>
            <p className="text-gray-600 text-lg">
              Pilihan terbaik untuk investasi dan hunian
            </p>
          </div>
        </div>
        {renderContent()}
      </main>

      <FilterPopup
        isOpen={isFilterOpen}
        onCloseAction={() => setFilterOpen(false)}
        onApplyAction={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
}
