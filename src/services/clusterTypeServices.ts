import axiosInstance from "@/utils/axios";
import {
  ClusterType,
  ClusterTypeResponse,
  CreateClusterTypePayload,
} from "@/types/clusterType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchClusterTypes = async (
  clusterId: string
): Promise<ClusterTypeResponse> => {
  const { data } = await axiosInstance.get<ClusterTypeResponse>(
    `/clusters/type/cluster/${clusterId}`
  );
  return data;
};

export const useClusterTypes = (clusterId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["cluster-type", clusterId],
    queryFn: () => fetchClusterTypes(clusterId),
    enabled: !!clusterId && enabled,
  });
};

export const createClusterType = async (payload: CreateClusterTypePayload) => {
  const { data } = await axiosInstance.post<ClusterType>(
    "/clusters/type",
    payload
  );
  return data;
};

export const useCreateClusterType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClusterTypePayload) =>
      createClusterType(payload),
    onSuccess: () => {
      // refresh cache setelah create
      queryClient.invalidateQueries({ queryKey: ["cluster-type"] });
    },
  });
};

export const updateClusterType = async (
  clusterTypeId: string,
  payload: CreateClusterTypePayload
) => {
  const { data } = await axiosInstance.put<ClusterType>(
    `/clusters/type/${clusterTypeId}`,
    payload
  );
  return data;
};

export const useUpdateClusterType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      clusterTypeId: string;
      payload: CreateClusterTypePayload;
    }) => updateClusterType(params.clusterTypeId, params.payload),
    onSuccess: () => {
      // refresh cache setelah create
      queryClient.invalidateQueries({ queryKey: ["cluster-type"] });
    },
  });
};

export const deleteClusterType = async (clusterTypeId: string) => {
  const { data } = await axiosInstance.put<ClusterType>(
    `/clusters/type/${clusterTypeId}`,
    {
      isDeleted: true,
    }
  );
  return data;
};

export const useDeleteClusterType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clusterTypeId: string) => deleteClusterType(clusterTypeId),
    onSuccess: () => {
      // refresh cache setelah create
      queryClient.invalidateQueries({ queryKey: ["cluster-type"] });
    },
  });
};
