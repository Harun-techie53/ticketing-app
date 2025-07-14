import axios from "axios";
import router from "next/router";
import { showGlobalToast } from "../utils/globals";
import { ToastType } from "@/types";

const API_BASE_URL = "";

// Optional helper for backend error format
const extractErrorMessages = (data: any): string[] => {
  if (Array.isArray(data?.errors)) {
    return data.errors.map((err: { message: string }) => err.message);
  }
  if (typeof data?.message === "string") {
    return [data.message];
  }
  return ["Unexpected error occurred"];
};

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // ✅ Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response Interceptor (Global Error Handling)
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        const messages = extractErrorMessages(error.response.data);

        messages.forEach((msg) => showGlobalToast(msg, ToastType.Error));

        // Optionally redirect for unauthorized errors
        if (status === 401 || status === 403) {
          router.push("/auth/login");
        }
      } else if (error.request) {
        showGlobalToast("No response from server", ToastType.Error);
      } else {
        showGlobalToast("Unexpected error", ToastType.Error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
