export interface StatusResponse {
  code: number;
  message: string;
}

export interface Property {
  id: number;
  propertyId: number;
  cluster_type_id: number;
  name: string;
  description: string;
  price: string;
  location: string;
  is_deleted: boolean;
  facility: string;
  spesification: string;
  selling_price: string | null;
  landArea: string | null;
  buildingArea: string | null;
  collateral_address: string;
  region_id: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  stock: number;
  developerId: number;
}

export interface PropertyResponse {
  status: StatusResponse;
  data: Property[];
}

// types/property.ts
export interface CreatePropertyPayload {
  clusterTypeId: number;
  name: string;
  description: string;
  price: string; // simpan sebagai string agar aman utk angka besar
  location: string;
  isDeleted: boolean;
  spesification: string;
  collateralAddress: string;
  regionId: number;
  stock: number;
  luasTanah: number | null; // m²
  luasBangunan: number | null; // m²
  jumlahLantai: number | null;
  jumlahKamarTidur: number | null;
  jumlahKamarMandi: number | null;
  garasi: boolean;
  kolamRenang: boolean;
  photos: File[]; // multiple files
}

export interface PropertyDetail {
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
  regionId: string;
  location: string;
  latitude: string | null;
  longitude: string | null;
  isDeleted: boolean;
  facilities: Array<{ name: string; value: number | boolean }>;
  spesifications: string;
  landArea: number | null;
  buildingArea: number | null;
  jumlahLantai: number | null;
  jumlahKamarTidur: number | null;
  jumlahKamarMandi: number | null;
  garasi: boolean;
  kolamRenang: boolean;
  collateralAddress: string;
  createdAt: string;
  updatedAt: string;
  stock: number;
  property_photo_urls: string[];
}

export interface PropertyDetailResponse {
  status: { code: number; message: string };
  data: PropertyDetail;
}
