"use client";

import {
  ExplorePropertiesResponse,
  FilterState,
  UserLocation,
} from "@/types/explore";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

function buildParams(
  searchTerm: string,
  sortBy: string,
  filters: FilterState | null,
  userLocation: UserLocation,
  pageNumber: number,
  pageSize: number
) {
  const pn = Math.max(1, Math.trunc(pageNumber || 1));
  const ps = Math.max(1, Math.trunc(pageSize || 12));

  const params: Record<string, any> = {
    search: searchTerm,
    sortBy,
    pageNumber: pn,
    pageSize: ps,
  };

  if (sortBy === "closestDistance" && userLocation) {
    params.userLat = userLocation.lat;
    params.userLng = userLocation.lng;
  }

  if (filters) {
    if (filters.price.min > 0) params.kisaranHargaMin = filters.price.min;
    if (filters.price.max < 10_000_000_000)
      params.kisaranHargaMax = filters.price.max;

    if (filters.bedrooms > 0) params.jumlahKamarTidur = filters.bedrooms;
    if (filters.bathrooms > 0) params.jumlahKamarMandi = filters.bathrooms;
    if (filters.floors > 0) params.jumlahLantai = filters.floors;

    if (filters.landArea.min > 0) params.luasTanahMin = filters.landArea.min;
    if (filters.landArea.max < 500) params.luasTanahMax = filters.landArea.max;

    if (filters.buildingArea.min > 0)
      params.luasBangunanMin = filters.buildingArea.min;
    if (filters.buildingArea.max < 500)
      params.luasBangunanMax = filters.buildingArea.max;
  }

  return params;
}

export function useExploreProperties(
  currentSearchTerm: string,
  currentSortBy: string,
  currentFilters: FilterState | null,
  userLocation: UserLocation,
  locationLoading: boolean,
  pageNumber: number,
  pageSize: number
) {
  const enabled =
    currentSortBy !== "closestDistance"
      ? true
      : !!userLocation && !locationLoading;

  return useQuery<ExplorePropertiesResponse>({
    queryKey: [
      "properties/explore",
      {
        search: currentSearchTerm,
        sortBy: currentSortBy,
        filters: currentFilters,
        userLocation,
        pageNumber,
        pageSize,
      },
    ],
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: (count, error) => {
      if (error instanceof Error && /Struktur data/.test(error.message))
        return false;
      return count < 1;
    },
    queryFn: async ({ signal }) => {
      if (
        currentSortBy === "closestDistance" &&
        !userLocation &&
        !locationLoading
      ) {
        throw new Error(
          "Mohon izinkan akses lokasi untuk mengurutkan properti berdasarkan jarak terdekat."
        );
      }

      const params = buildParams(
        currentSearchTerm,
        currentSortBy,
        currentFilters,
        userLocation,
        pageNumber,
        pageSize
      );

      try {
        const { data } = await axiosInstance.get<ExplorePropertiesResponse>(
          `/properties/explore`,
          {
            params,
          }
        );

        return data;
      } catch (err) {
        throw err as Error;
      }
    },
  });
}
