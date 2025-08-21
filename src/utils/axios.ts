import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export { axiosInstance, axiosServer };
