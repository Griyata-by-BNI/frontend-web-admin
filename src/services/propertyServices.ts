import { CreatePropertyPayload, PropertyResponse } from "@/types/property";
import appendIfDefined from "@/utils/appendIfDefined";
import axiosInstance from "@/utils/axios";
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

// custom hook pakai useQuery
export const usePropertiesByClusterType = (clusterTypeId: number) => {
  return useQuery<PropertyResponse>({
    queryKey: ["properties", clusterTypeId],
    queryFn: () => fetchPropertiesByClusterType(clusterTypeId),
    enabled: !!clusterTypeId, // hanya jalan kalau ada id
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

  // opsional/nullable
  appendIfDefined(fd, "luasTanah", payload.luasTanah);
  appendIfDefined(fd, "luasBangunan", payload.luasBangunan);
  appendIfDefined(fd, "jumlahLantai", payload.jumlahLantai);
  appendIfDefined(fd, "jumlahKamarTidur", payload.jumlahKamarTidur);
  appendIfDefined(fd, "jumlahKamarMandi", payload.jumlahKamarMandi);

  appendIfDefined(fd, "garasi", payload.garasi);
  appendIfDefined(fd, "kolamRenang", payload.kolamRenang);

  // multiple files (key sama: "photos")
  payload.photos.forEach((file) => {
    if (file) fd.append("photos", file);
  });

  return fd;
};

export const createProperty = async (payload: CreatePropertyPayload) => {
  const formData = buildCreatePropertyFormData(payload); // gunakan helper sebelumnya
  const { data } = await axiosInstance.post("/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// hook useMutation
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),

    // invalidate list berdasarkan clusterTypeId dari payload
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["properties", variables.clusterTypeId],
      });
    },

    // opsional: logging / penanganan error terketik
    onError: (err: AxiosError) => {
      // misalnya tampilkan notifikasi / console.error
      console.error(
        "Create property failed:",
        err.response?.data ?? err.message
      );
    },
  });
};
