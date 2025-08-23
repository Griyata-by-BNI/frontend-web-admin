export type Cluster = {
  id: number;
  developerId: number;
  developerName: string;
  latitude: string;
  longitude: string;
  facilities: string;
  phoneNumber: string;
  description: string;
  maxPrice: string;
  minPrice: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  cluster_photo_urls: string[];
};

export type GetClustersResponse = {
  status: {
    code: number;
    message: string;
  };
  data: {
    clusters: Cluster[];
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  sorting: {
    sortBy: string;
    sortDir: string;
  };
};

export interface GetDetailClusterResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    clusters: DetailCluster[];
  };
}

export interface DetailCluster extends Cluster {
  nearbyPlaces: NearbyPlace[];
}

export interface NearbyPlace {
  type: string; // contoh: "hospital" | "school" | "mall" dll
  places: Place[];
}

export interface Place {
  name: string;
  distance: number;
}

export interface PayloadCluster {
  name: string;
  description: string;
  developerId: number;
  facilities: string;
  createdBy: number;
  updatedBy: number;
  address: string;
  phoneNumber: string;
  longitude: number;
  latitude: number;
  photos: File[];
  nearbyPlaces: NearbyPlace;
}

export type FetchClustersOptions = {
  pageNumber?: number;
  pageSize?: number;
  signal?: AbortSignal;
};

export interface LatestCluster {
  id: number;
  developerId: number;
  maxPrice: string; // datang sebagai string dari API
  minPrice: string; // datang sebagai string dari API
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  address: string;
  cluster_photo_urls: string[];
}

export interface LatestClustersResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    clusters: Cluster[];
  };
}
