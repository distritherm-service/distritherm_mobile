import axios from "axios";
import storageService from "src/services/storageService";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

// const API_BASE_URL = "http://192.168.1.11:3000";

const API_BASE_URL = "http://10.192.251.243:3000";

// Instance globale de l'API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-platform": "mobile",
  },
});

// Variable pour stocker le callback de déconnexion
let logoutCallback: (() => Promise<any>) | null = null;

// Configuration des intercepteurs
api.interceptors.request.use(async (config: any) => {
  const token = await storageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 &&
        !originalRequest._retry &&
        (error.response?.data?.message === "Token invalide ou expiré" ||
         error.response?.data?.message === "Token invalide")) ||
      error.response?.data?.message ==
        "Erreur lors de la récupération de l'utilisateur à partir du token: jwt expired"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storageService.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );
        const { accessToken } = response.data as any;

        await storageService.setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (logoutCallback) {
          await logoutCallback();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Fonction pour configurer le callback de déconnexion
export const setLogoutCallback = (callback: () => Promise<any>) => {
  logoutCallback = callback;
};

// Fonction pour configurer l'API (pour compatibilité)
export const configureApi = (callback: () => Promise<any>) => {
  setLogoutCallback(callback);
  return api;
};

export default api;
