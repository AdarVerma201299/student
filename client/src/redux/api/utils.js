import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
// "https://student-30a2.onrender.com/api" ||
export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Enhanced request interceptor
API.interceptors.request.use((config) => {
  const rawToken = localStorage.getItem("authToken");

  if (rawToken) {
    try {
      // Handle both stringified and raw tokens
      const authToken = rawToken.startsWith('"')
        ? JSON.parse(rawToken)
        : rawToken;
      config.headers.Authorization = `Bearer ${authToken}`;
    } catch (err) {
      console.error("Token parsing error:", err);
    }
  }
  return config;
});

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Convert to a standard error format
    const apiError = new Error(errorMessage);
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;

    return Promise.reject(apiError);
  }
);
