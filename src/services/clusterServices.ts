import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import {
  GetClustersResponse,
  GetDetailClusterResponse,
  PayloadCluster,
} from "@/types/cluster";

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

export const useClusterById = (clusterId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["cluster-detail", clusterId],
    queryFn: () => fetchClusterById(clusterId),
    enabled: !!clusterId && enabled,
  });
};

const createCluster = async (payload: PayloadCluster) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("developerId", payload.developerId.toString());
  formData.append("facilities", payload.facilities);
  formData.append("createdBy", payload.createdBy.toString());
  formData.append("updatedBy", payload.updatedBy.toString());
  formData.append("address", payload.address);
  formData.append("phone_number", payload.phone_number);
  formData.append("longitude", payload.longitude.toString());
  formData.append("latitude", payload.latitude.toString());
  formData.append("nearbyPlaces", JSON.stringify(payload.nearbyPlaces));

  payload.photos.forEach((file) => {
    formData.append("photos", file);
  });

  const { data } = await axiosInstance.post("/clusters", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const useCreateCluster = () => {
  return useMutation({
    mutationFn: createCluster,
  });
};

const updateCluster = async ({
  id,
  payload,
}: {
  id: string;
  payload: PayloadCluster;
}) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("developerId", payload.developerId.toString());
  formData.append("facilities", payload.facilities);
  formData.append("createdBy", payload.createdBy.toString());
  formData.append("updatedBy", payload.updatedBy.toString());
  formData.append("address", payload.address);
  formData.append("phone_number", payload.phone_number);
  formData.append("longitude", payload.longitude.toString());
  formData.append("latitude", payload.latitude.toString());
  formData.append("nearbyPlaces", JSON.stringify(payload.nearbyPlaces));

  payload.photos.forEach((file) => {
    formData.append("photos", file);
  });

  const { data } = await axiosInstance.put(`/clusters/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const useUpdateCluster = () => {
  return useMutation({
    mutationFn: updateCluster,
  });
};
