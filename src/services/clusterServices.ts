import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { GetClustersResponse, GetDetailClusterResponse } from "@/types/cluster";

export const fetchClusters = async (): Promise<GetClustersResponse> => {
  const { data } = await axiosInstance.get<GetClustersResponse>("/clusters");
  return data;
};

export const useClusters = () => {
  return useQuery({
    queryKey: ["clusters"],
    queryFn: fetchClusters,
  });
};

export const fetchClustersByDeveloper = async (
  id: string
): Promise<GetClustersResponse> => {
  const { data } = await axiosInstance.get<GetClustersResponse>(
    `/clusters/developer/${id}`
  );
  return data;
};

export const useClustersByDeveloper = (developerId: string) => {
  return useQuery({
    queryKey: ["clusters", "developer", developerId],
    queryFn: () => fetchClustersByDeveloper(developerId),
    enabled: !!developerId,
  });
};

export const fetchClusterById = async (
  id: string
): Promise<GetDetailClusterResponse> => {
  const { data } = await axiosInstance.get<GetDetailClusterResponse>(
    `/clusters/${id}`
  );
  return data;
};

export const useClusterById = (clusterId: string) => {
  return useQuery({
    queryKey: ["cluster-detail", clusterId],
    queryFn: () => fetchClusterById(clusterId),
    enabled: !!clusterId,
  });
};
