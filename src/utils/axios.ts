import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://3c547af09e2a.ngrok-free.app/api/v1",
});

export default axiosInstance;
