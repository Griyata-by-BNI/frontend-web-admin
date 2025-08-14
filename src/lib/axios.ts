import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://199b6abb7281.ngrok-free.app/api/v1",
});

export default axiosInstance;
