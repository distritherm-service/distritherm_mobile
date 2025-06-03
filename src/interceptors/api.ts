import axios from "axios";
import storageService from "src/services/storageService";
import store from "src/store/store";
import { logoutUser } from "src/store/features/userState";

// Dans Expo, les variables d'environnement sont accessibles via process.env
// Elles doivent commencer par EXPO_PUBLIC_ pour être accessibles côté client
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-platform": "mobile",
  },
});

api.interceptors.request.use((config: any) => {
  const token = storageService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response: any) => response, async (error: any) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
    // Rafraîchir le token
    const refreshToken = await storageService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    // Appel à l'API pour rafraîchir le token
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
    const { accessToken } = response.data as any;

    // Sauvegarder les nouveaux tokens
    await storageService.setAccessToken(accessToken);

    // Mettre à jour l'en-tête de la requête originale
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

    // Renvoyer la requête originale avec le nouveau token
    return api(originalRequest);
    } catch (refreshError) {
      store.dispatch(logoutUser());
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default api;
