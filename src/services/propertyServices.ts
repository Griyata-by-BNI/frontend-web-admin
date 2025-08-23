import {
  CreatePropertyPayload,
  Property,
  PropertyDetailResponse,
  PropertyResponse,
} from "@/types/property";
import appendIfDefined from "@/utils/appendIfDefined";
import { axiosInstance } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const fetchPropertiesByClusterType = async (
  clusterTypeId: number
): Promise<PropertyResponse> => {
  const { data } = await axiosInstance.get<PropertyResponse>(
    `/properties/cluster-type/${clusterTypeId}`
  );
  return data;
};

export const usePropertiesByClusterType = (clusterTypeId: number) => {
  return useQuery<PropertyResponse>({
    queryKey: ["properties", clusterTypeId],
    queryFn: () => fetchPropertiesByClusterType(clusterTypeId),
    enabled: !!clusterTypeId,
  });
};

export const buildCreatePropertyFormData = (payload: CreatePropertyPayload) => {
  const fd = new FormData();

  appendIfDefined(fd, "clusterTypeId", payload.clusterTypeId);
  appendIfDefined(fd, "name", payload.name);
  appendIfDefined(fd, "description", payload.description);
  appendIfDefined(fd, "price", payload.price);
  appendIfDefined(fd, "location", payload.location);
  appendIfDefined(fd, "isDeleted", payload.isDeleted);
  appendIfDefined(fd, "spesification", payload.spesification);
  appendIfDefined(fd, "collateralAddress", payload.collateralAddress);
  appendIfDefined(fd, "regionId", payload.regionId);
  appendIfDefined(fd, "stock", payload.stock);

  appendIfDefined(fd, "luasTanah", payload.luasTanah);
  appendIfDefined(fd, "luasBangunan", payload.luasBangunan);
  appendIfDefined(fd, "jumlahLantai", payload.jumlahLantai);
  appendIfDefined(fd, "jumlahKamarTidur", payload.jumlahKamarTidur);
  appendIfDefined(fd, "jumlahKamarMandi", payload.jumlahKamarMandi);

  appendIfDefined(fd, "garasi", payload.garasi);
  appendIfDefined(fd, "kolamRenang", payload.kolamRenang);

  payload.photos.forEach((file) => {
    if (file) fd.append("photos", file);
  });

  return fd;
};

export const createProperty = async (payload: CreatePropertyPayload) => {
  const formData = buildCreatePropertyFormData(payload);
  const { data } = await axiosInstance.post("/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["properties", variables.clusterTypeId],
      });
    },

    onError: (err: AxiosError) => {
      console.error(
        "Create property failed:",
        err.response?.data ?? err.message
      );
    },
  });
};

export type UpdatePropertyVariables = {
  id: number;
  payload: CreatePropertyPayload;
  deletePhotoUrls?: string[];
};

// ==== form-data builder khusus UPDATE ====
const buildUpdatePropertyFormData = ({
  payload,
  deletePhotoUrls,
}: UpdatePropertyVariables) => {
  const fd = new FormData();

  const { photos, ...rest } = payload as Record<string, any>;

  Object.entries(rest).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, String(v));
  });

  if (Array.isArray(photos)) {
    photos.forEach((file) => {
      if (file instanceof File) fd.append("photos", file);
    });
  }

  (deletePhotoUrls ?? []).forEach((url) => {
    if (url) fd.append("deletePhotoUrls", url);
  });

  return fd;
};

export const updateProperty = async (vars: UpdatePropertyVariables) => {
  const formData = buildUpdatePropertyFormData(vars);

  const { data } = await axiosInstance.put(`/properties/${vars.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: UpdatePropertyVariables) => updateProperty(vars),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["properties", variables.payload.clusterTypeId],
      });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },

    onError: (err: AxiosError) => {
      console.error(
        "Update property failed:",
        err.response?.data ?? err.message
      );
    },
  });
};

export const fetchPropertyById = async (
  id: number
): Promise<PropertyDetailResponse> => {
  const { data } = await axiosInstance.get<PropertyDetailResponse>(
    `/properties/${id}`
  );
  return data;
};

export const useFetchPropertyById = () => {
  return useMutation({
    mutationFn: (id: number) => fetchPropertyById(id),
  });
};

export const usePropertyById = (id?: number) => {
  return useQuery<PropertyDetailResponse>({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
};

export const deleteProperty = async ({
  propertyData,
}: {
  propertyData: Property;
}) => {
  const formData = new FormData();
  formData.append("isDeleted", "true");
  formData.append("name", propertyData.name);
  formData.append("price", propertyData.price);
  formData.append("stock", String(propertyData.stock));
  formData.append("regionId", String(propertyData.region_id));
  formData.append("clusterTypeId", String(propertyData.cluster_type_id));

  const { data } = await axiosInstance.put(
    `/properties/${propertyData.propertyId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyData }: { propertyData: Property }) =>
      deleteProperty({ propertyData }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["properties", variables.propertyData.cluster_type_id],
      });
    },

    onError: (err: AxiosError) => {
      console.error(
        "Update property failed:",
        err.response?.data ?? err.message
      );
    },
  });
};
