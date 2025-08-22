// utils/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

// ===== Client instance =====
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "ngrok-skip-browser-warning": "true" },
});

// inject Authorization dari cookie (client)
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// ===== Server (tanpa auth, untuk kompatibilitas lama) =====
const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "ngrok-skip-browser-warning": "true" },
});

// ===== Server (dengan auth per-request dari cookie) =====
export async function axiosServerWithAuth() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get("auth_token")?.value;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "ngrok-skip-browser-warning": "true" },
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

export { axiosInstance, axiosServer };
