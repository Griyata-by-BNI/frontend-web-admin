import axios from "axios";
import {
  FavoriteProperty,
  AddFavoriteRequest,
  FavoriteResponse,
  AddFavoriteResponse,
} from "@/types/favorite";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

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

export const getFavoriteProperties = async (
  userId: number
): Promise<FavoriteProperty[]> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    console.log("Calling API:", `/properties/favorite?userId=${userId}`);

    const response = await apiClient.get<FavoriteResponse>(
      `/properties/favorite`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.properties || [];
  } catch (error: any) {
    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Return empty array for 404 (no favorites yet)
    if (error.response?.status === 404) {
      return [];
    }

    throw error;
  }
};

export const addToFavorites = async (
  data: AddFavoriteRequest
): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    await apiClient.post<AddFavoriteResponse>("/properties/favorite", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    return false;
  }
};

export const removeFromFavorites = async (
  favoriteId: number,
  userId: number
): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    await apiClient.delete(
      `/properties/favorite/${favoriteId}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
    return false;
  }
};
