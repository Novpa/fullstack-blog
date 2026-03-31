import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// REQUEST INTERCEPTORS - add access token in every api request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  (response) => response,
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      //error is 401, nevery tried, it's not from /auth/refresh
      originalRequest._retry = true;

      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/auth/refresh",
          { withCredentials: true },
        );
        // console.log("data interceptors", data);

        const accessToken = data.data.accessToken;
        useAuthStore.getState().setAuth(accessToken, data.data.user);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
