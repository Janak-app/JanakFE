import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "1",
  },
});
