import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://924088c4bf09.ngrok-free.app/api/v1",
});

export default axiosInstance;
