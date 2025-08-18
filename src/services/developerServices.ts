import { Developer, PayloadDeveloper } from "@/types/developer";
import axiosInstance from "@/utils/axios";
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

const updateDeveloper = async (data: Developer) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("isDeleted", String(data.isDeleted ?? false));
  formData.append("updatedBy", String(data.updatedBy));
  formData.append("developerPhotoUrl", data.developerPhotoUrl);

  const response = await axiosInstance.put(`/developer/${data.id}`, formData, {
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

const deleteDeveloper = async (data: { id: number; updatedBy: number }) => {
  const formData = new FormData();
  formData.append("isDeleted", "true");
  formData.append("updatedBy", String(data.updatedBy));

  const response = await axiosInstance.put(`/developer/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useDeleteDeveloper = () => {
  return useMutation({
    mutationFn: deleteDeveloper,
  });
};

const getDevelopers = async (): Promise<Developer[]> => {
  const response = await axiosInstance.get("/developers");
  return response.data;
};

export const useGetDevelopers = () => {
  return useQuery({
    queryKey: ["developers"],
    queryFn: getDevelopers,
  });
};
