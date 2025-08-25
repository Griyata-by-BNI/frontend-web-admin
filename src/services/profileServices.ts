import { Profile, ProfileResponse } from "@/types/profile";
import { axiosInstance } from "@/utils/axios";

export const fetchProfile = async (
  userId: string,
  token: string
): Promise<Profile> => {
  const res = await axiosInstance.get<ProfileResponse>(`/profiles/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data?.data?.profile || {};
};
