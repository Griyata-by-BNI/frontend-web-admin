import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://c59f7cc01b89.ngrok-free.app",
});

export default axiosInstance;
