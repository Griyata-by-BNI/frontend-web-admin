import { useAuth } from "@/contexts/authContext";
import {
  SubmissionSummary,
  SubmissionDetail,
  PropertyDetail,
  ApiStatus,
} from "@/types/riwayat";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const getAuthToken = (): string | null => {
  if (typeof document !== "undefined") {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1] || null
    );
  }
  return null;
};

export const getSubmissionsByUserId = async (
  userId: number,
  status: ApiStatus
): Promise<SubmissionSummary[]> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await axiosInstance.get<{
      status: { code: number; message: string };
      data: SubmissionSummary[];
    }>(`/kpr/submission/history/${userId}`, {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data || [];
  } catch (error: any) {
    console.error(`API Error for status ${status}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      userId,
      requestedStatus: status,
    });

    // Return empty array for 404 (no submissions yet)
    if (error.response?.status === 404) {
      return [];
    }

    return [];
  }
};

export const getSubmissionById = async (
  id: number
): Promise<SubmissionDetail | null> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await axiosInstance.get<{
      status: { code: number; message: string };
      data: SubmissionDetail;
    }>(`/kpr/submission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch submission ${id}:`, error);
    return null;
  }
};

export const getPropertyById = async (
  id: number
): Promise<PropertyDetail | null> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await axiosInstance.get<{
      status: { code: number; message: string };
      data: PropertyDetail;
    }>(`/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch property ${id}:`, error);
    return null;
  }
};

export const useSubmissionsByStatus = (status: ApiStatus) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["submissions", user?.userId, status],
    queryFn: () => {
      if (!user?.userId) throw new Error("User ID not found");
      return getSubmissionsByUserId(parseInt(user.userId), status);
    },
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubmissionDetail = (id: number) => {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id && !isNaN(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePropertyDetail = (propertyId: number | undefined) => {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId!),
    enabled: !!propertyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
