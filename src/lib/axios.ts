import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://44040cdf10f5.ngrok-free.app",
});

export default axiosInstance;
