import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios";
import {
  FetchClustersOptions,
  GetClustersResponse,
  GetDetailClusterResponse,
  LatestClustersResponse,
  PayloadCluster,
} from "@/types/cluster";

export const fetchClusters = async ({
  pageNumber = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortDir = "DESC",
  signal,
}: FetchClustersOptions): Promise<GetClustersResponse> => {
  const { data } = await axiosInstance.get<GetClustersResponse>("/clusters", {
    params: { pageNumber, pageSize, sortBy, sortDir },
    signal,
  });
  return data;
};

export const useClusters = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["clusters", { pageNumber, pageSize }],
    queryFn: ({ signal }) => fetchClusters({ pageNumber, pageSize, signal }),
    placeholderData: keepPreviousData,
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
  formData.append("phoneNumber", payload.phoneNumber);
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

type UpdateClusterVariables = {
  id: string;
  payload: PayloadCluster;
  deletePhotoUrls?: string[];
};

const updateCluster = async ({
  id,
  payload,
  deletePhotoUrls,
}: UpdateClusterVariables) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("developerId", payload.developerId.toString());
  formData.append("facilities", payload.facilities);
  formData.append("createdBy", payload.createdBy.toString());
  formData.append("updatedBy", payload.updatedBy.toString());
  formData.append("address", payload.address);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("longitude", payload.longitude.toString());
  formData.append("latitude", payload.latitude.toString());
  formData.append("nearbyPlaces", JSON.stringify(payload.nearbyPlaces));

  (payload.photos ?? []).forEach((file) => {
    if (file instanceof File) formData.append("photos", file);
  });

  (deletePhotoUrls ?? []).forEach((url) => {
    if (url) formData.append("deletePhotoUrls[]", url);
  });

  const { data } = await axiosInstance.put(`/clusters/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const useUpdateCluster = () => {
  return useMutation({
    mutationFn: (vars: UpdateClusterVariables) => updateCluster(vars),
  });
};

const deleteCluster = async ({ id }: { id: string }) => {
  const formData = new FormData();
  formData.append("isDeleted", "true");

  const { data } = await axiosInstance.put(`/clusters/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const useDeleteCluster = () => {
  return useMutation({
    mutationFn: deleteCluster,
  });
};

export const fetchLatestClusters =
  async (): Promise<LatestClustersResponse> => {
    const { data } = await axiosInstance.get<LatestClustersResponse>(
      "/clusters/latest/clusters"
    );
    return data;
  };

export const useLatestClusters = () =>
  useQuery<LatestClustersResponse>({
    queryKey: ["latest-clusters"],
    queryFn: fetchLatestClusters,
    staleTime: 5 * 60 * 1000,
  });
