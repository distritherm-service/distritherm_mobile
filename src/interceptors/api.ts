import axios from "axios";
import storageService from "src/services/storageService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

// const API_BASE_URL = "http://172.20.10.2:3000";

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

// Set pour éviter les tentatives multiples de refresh simultanées
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  
  failedQueue = [];
};

// Messages d'erreur qui indiquent une expiration de token nécessitant un refresh
const TOKEN_EXPIRATION_MESSAGES = [
  // AccessTokenGuard
  "Le token d'accès est manquant ou mal formaté",
  "Le token d'accès est manquant",
  "Token invalide",
  "Cet utilisateur n'existe pas, veuillez vous re-connecter. Votre session a été révoquée.",
  
  // JwtService
  "Le token a expiré. Veuillez vous reconnecter.",
  "Le token est invalide. Veuillez vérifier votre authentification.",
  "L'utilisateur actuellement connecté n'existe pas, veuillez vous reconnecter",
  
  // AuthService
  "Token invalide ou expiré",
  "Utilisateur non trouvé",
  "Échec du rafraîchissement du token",
  
  // JwtAuthGuard & AuthUserGuard
  "Authentification requise",
  "Non autorisé - Token invalide",
  "Non autorisé - Token manquant",
  
  // Messages d'erreur avec pattern pour les erreurs JWT
  "jwt expired",
  "jwt malformed",
  "invalid token",
  "token expired"
];

// Fonction pour vérifier si le message d'erreur indique une expiration de token
const isTokenExpirationError = (errorMessage: string): boolean => {
  if (!errorMessage) return false;
  
  const message = errorMessage.toLowerCase();
  
  return TOKEN_EXPIRATION_MESSAGES.some(pattern => 
    message.includes(pattern.toLowerCase())
  );
};

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

    // Vérifier si c'est une erreur d'authentification avec expiration de token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') && // Éviter les boucles
      !originalRequest.url?.includes('/auth/logout') && // Éviter de refresher lors du logout
      isTokenExpirationError(error.response?.data?.message)
    ) {
      originalRequest._retry = true;

      // Si un refresh est déjà en cours, ajouter la requête à la queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await storageService.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Appel de l'endpoint refresh-token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token?refresh_token=${encodeURIComponent(refreshToken)}`,
          {}, // Body vide pour mobile
          {
            headers: {
              "Content-Type": "application/json",
              "x-platform": "mobile",
            },
            timeout: 10000, // Timeout spécifique pour le refresh
          }
        );

        const { accessToken } = response.data as { accessToken: string; message: string };

        if (!accessToken) {
          throw new Error("No access token received from refresh");
        }

        // Sauvegarder le nouveau token
        await storageService.setAccessToken(accessToken);
        
        // Mettre à jour l'en-tête de la requête originale
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Traiter la queue des requêtes en attente
        processQueue(null, accessToken);
        
        isRefreshing = false;
        
        // Relancer la requête originale
        return api(originalRequest);
        
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        console.error("Erreur lors du refresh token:", refreshError);
        
        // Si le refresh échoue, déconnecter l'utilisateur
        if (logoutCallback) {
          try {
            await logoutCallback();
          } catch (logoutError) {
            console.error("Erreur lors de la déconnexion automatique:", logoutError);
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Pour toutes les autres erreurs (y compris les 401 légitimes), les passer tel quel
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
