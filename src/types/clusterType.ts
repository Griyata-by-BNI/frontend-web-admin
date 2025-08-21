export interface ClusterType {
  id: number;
  cluster_id: number;
  name: string;
  description: string;
  is_deleted: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ClusterTypeResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    clusterTypes: ClusterType[];
  };
}

export interface CreateClusterTypePayload {
  clusterId: number;
  name: string;
  description: string;
}
