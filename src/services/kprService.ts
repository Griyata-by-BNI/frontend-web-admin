import {
  SubmissionSummary,
  SubmissionDetail,
  PropertyDetail,
  ApiStatus,
} from "@/types/riwayat";
import axiosInstance from "@/utils/axios";

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

    console.log(
      `Calling API: /api/v1/kpr/submission/history/${userId}?status=${status}`
    );

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
