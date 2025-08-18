import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://b3f5f78f975e.ngrok-free.app",
});

export default axiosInstance;
