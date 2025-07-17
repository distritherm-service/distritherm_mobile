import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  initializeAuth,
  loginUser,
  logoutUser,
  setDeconnectionLoading,
} from "../store/features/userState";
import { UserWithClientDto } from "../types/User";
import api, { setLogoutCallback } from "../interceptors/api";
import storageService from "src/services/storageService";
import { useCallback, useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, deconnectionLoading } = useSelector(
    (state: RootState) => state.user
  );

  // 🚀 Initialiser l'authentification au montage de l'app
  const initialize = async () => {
    await dispatch(initializeAuth());
  };

  const login = async (
    userData: UserWithClientDto,
    accessToken: string,
    refreshToken: string
  ) => {
    return await dispatch(
      loginUser({ user: userData, accessToken, refreshToken })
    );
  };

  const logout = useCallback(async () => {
    try {
      // Activer le loading de déconnexion
      dispatch(setDeconnectionLoading(true));

      const refreshToken = await storageService.getRefreshToken();
      if (refreshToken) {
        try {
          await api.post(`/auth/logout?refresh_token=${encodeURIComponent(refreshToken)}`);
        } catch (error: any) {
          // Si l'erreur est liée à un token invalide, on continue quand même la déconnexion
          console.warn("Erreur lors de l'appel API de déconnexion:", error);
        }
      }
    } catch (error: any) {
      // Ignorer les erreurs de logout API
      console.warn("Erreur lors de l'appel API de déconnexion:", error);
    } finally {
      // Effectuer la déconnexion locale (qui désactivera automatiquement le loading)
      return dispatch(logoutUser());
    }
  }, [dispatch]);

  // Configurer le callback de déconnexion pour l'intercepteur API
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  return {
    isAuthenticated,
    user,
    deconnectionLoading,
    initialize,
    login,
    logout,
  };
};
