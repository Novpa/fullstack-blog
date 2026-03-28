import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// src/api/axiosInstance.ts

// let isRefreshing = false; // Flag untuk menandai apakah sedang ada proses refresh
// let failedQueue: any[] = []; // Antrean request yang gagal saat token expired

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // Jika sudah ada yang sedang refresh, masukkan request ini ke antrean
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true; // Tandai bahwa proses refresh dimulai

//       return new Promise((resolve, reject) => {
//         api
//           .get("/auth/refresh")
//           .then(({ data }) => {
//             const { accessToken, user } = data.data;
//             useAuthStore.getState().setAuth(accessToken, user);

//             // Lanjutkan request asli yang tadi gagal
//             originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//             // Jalankan semua antrean yang tadi menunggu
//             processQueue(null, accessToken);

//             resolve(api(originalRequest));
//           })
//           .catch((err) => {
//             processQueue(err, null);
//             useAuthStore.getState().clearAuth();
//             reject(err);
//           })
//           .finally(() => {
//             isRefreshing = false; // Buka kunci setelah semua selesai
//           });
//       });
//     }

//     return Promise.reject(error);
//   },
// );

// REQUEST INTERCEPTORS - add access token in every api request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/auth/refresh",
          { withCredentials: true },
        );

        console.log("data interceptors", data);

        const accessToken = data.data.accessToken;

        useAuthStore.getState().setAuth(accessToken, data.data.user);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
