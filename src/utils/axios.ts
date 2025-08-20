import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default axiosInstance;
