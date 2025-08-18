import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { GetClustersResponse } from "@/types/cluster";

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
