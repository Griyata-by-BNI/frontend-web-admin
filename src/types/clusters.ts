export type Cluster = {
  id: number;
  developerId: number;
  developerName: string;
  latitude: string;
  longitude: string;
  facilities: string;
  phone_number: string;
  max_price: string;
  min_price: string;
  name: string;
  description: string;
  createdBy: number;
  updatedBy: number;
  address: string;
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
