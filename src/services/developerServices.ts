import {
  Developer,
  PayloadDeveloper,
  PayloadUpdateDeveloper,
  ResponseGetAllDeveloper,
  ResponseGetDeveloperById,
} from "@/types/developer";
import { axiosInstance } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const createDeveloper = async (data: PayloadDeveloper) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("isDeleted", String(data.isDeleted ?? false));
  formData.append("createdBy", String(data.createdBy));
  formData.append("updatedBy", String(data.updatedBy));
  formData.append("developerPhotoUrl", data.developerPhotoUrl);

  const response = await axiosInstance.post("/developers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useCreateDeveloper = () => {
  return useMutation({
    mutationFn: createDeveloper,
  });
};

const updateDeveloper = async (data: PayloadUpdateDeveloper) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("isDeleted", String(data.isDeleted ?? false));
  formData.append("updatedBy", String(data.updatedBy));

  if (data.developerPhotoUrl) {
    formData.append("developerPhotoUrl", data.developerPhotoUrl);
  }

  const response = await axiosInstance.put(`/developers/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUpdateDeveloper = () => {
  return useMutation({
    mutationFn: updateDeveloper,
  });
};

const getDevelopers = async (
  pageSize?: number,
  pageNumber?: number,
  search?: string,
  sortBy: string = "updatedAt",
  sortDir: "ASC" | "DESC" = "DESC"
): Promise<ResponseGetAllDeveloper> => {
  const params = new URLSearchParams();
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (pageNumber) params.append("pageNumber", pageNumber.toString());
  if (search) params.append("search", search);
  params.append("sortBy", sortBy);
  params.append("sortDir", sortDir);

  const response = await axiosInstance.get<ResponseGetAllDeveloper>(
    `/developers${params.toString() ? "?" + params.toString() : ""}`
  );

  return response.data;
};

export const useGetDevelopers = (
  pageSize?: number,
  pageNumber?: number,
  search?: string,
  sortBy: string = "updatedAt",
  sortDir: "ASC" | "DESC" = "DESC"
) => {
  return useQuery<ResponseGetAllDeveloper>({
    queryKey: ["developers", pageSize, pageNumber, search, sortBy, sortDir],
    queryFn: () => getDevelopers(pageSize, pageNumber, search, sortBy, sortDir),
  });
};

const getDeveloperById = async (
  id: number
): Promise<ResponseGetDeveloperById> => {
  const response = await axiosInstance.get<ResponseGetDeveloperById>(
    `/developers/${id}`
  );
  return response.data;
};

export const useDetailDeveloper = (id: number) => {
  const enabled = typeof id === "number" && Number.isFinite(id);
  return useQuery<ResponseGetDeveloperById>({
    queryKey: ["developer", id],
    queryFn: () => getDeveloperById(id),
    enabled: enabled,
  });
};
