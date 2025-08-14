import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { GetClustersResponse } from "@/types/clusters";

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
