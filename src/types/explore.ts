export type FilterState = {
  price: { min: number; max: number };
  landArea: { min: number; max: number };
  buildingArea: { min: number; max: number };
  bedrooms: number;
  bathrooms: number;
  floors: number;
};

export type UserLocation = { lat: number; lng: number } | null;

// ---- Common ----
export interface ApiStatus {
  code: number;
  message: string;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  itemsCount: number;
  isLastPage: boolean;
  itemsTotal: number;
}

// ---- Facilities ----
type FacilityNameNumeric = "KT" | "KM" | "LB" | "LT" | "jumlahLantai";
type FacilityNameBoolean = "garasi" | "kolam_renang";

/**
 * Known facilities: tipe value dibedakan sesuai nama.
 * Ditambah fallback agar tetap aman jika backend menambah nama lain.
 */
export type Facility =
  | { name: FacilityNameNumeric; value: number }
  | { name: FacilityNameBoolean; value: boolean }
  | { name: string; value: number | boolean }; // fallback untuk future-proof

// ---- Property item ----
export interface ExploreProperty {
  id: number;
  location: string;
  propertyName: string;
  developerId: number;
  clusterId: number;
  developerName: string;
  clusterTypeName: string;
  price: number;
  facilities: Facility[];
  updatedAt: string;
  photoUrl: string;
  distanceKm?: number;
}

// ---- Response root ----
export interface ExplorePropertiesResponse {
  status: ApiStatus;
  data: {
    properties: ExploreProperty[];
  };
  pagination: Pagination;
}
