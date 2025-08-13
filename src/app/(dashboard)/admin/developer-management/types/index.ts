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
  id: string;
  name: string;
  description: string;
  phone_number: string;
  images: string[];
  latitude: number;
  longitude: number;
  facilities: string[];
  created_at: string;
  updated_at: string;
};
