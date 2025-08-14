export type Developer = {
  id: string;
  name: string;
  image: string;
  cluster_count: string;
  phone_number: string;
  description: string;
  created_at: string;
  updated_at: string;
};

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

export type ClusterType = {
  id: number;
  developerId: number;
  developerName: string;
  clusterId: number;
  clusterName: string;
  name: string;
  propertyCount: number;
  createdBy: number;
  updatedBy: number;
};

export type Property = {
  id: number;
  developerId: number;
  developerName: string;
  clusterId: number;
  clusterName: string;
  clusterTypeId: number;
  clusterTypeName: string;
  name: string;
  description: string;
  price: string;
  location: string;
  latitude: string;
  longitude: string;
  isDeleted: boolean;
  facilities: string;
  spesifications: string;
  sellingPrice: string;
  landArea: string;
  stock: number;
  buildingArea: string;
  collateralAddress: string;
  createdAt: string;
  updatedAt: string;
  property_photo_urls: string[];
};
