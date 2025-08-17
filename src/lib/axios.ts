import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://aea65d68bcd5.ngrok-free.app",
});

export default axiosInstance;
