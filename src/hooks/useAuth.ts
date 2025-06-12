import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  initializeAuth,
  loginUser,
  logoutUser,
  setDeconnectionLoading,
} from "../store/features/userState";
import { UserWithClientDto } from "../types/User";
import api from "../interceptors/api";
import storageService from "src/services/storageService";

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

  const logout = async () => {
    try {
      // Activer le loading de déconnexion
      dispatch(setDeconnectionLoading(true));

      const refreshToken = await storageService.getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error: any) {
      // Ignorer les erreurs de logout API
      console.warn("Erreur lors de l'appel API de déconnexion:", error);
    } finally {
      // Effectuer la déconnexion locale (qui désactivera automatiquement le loading)
      return dispatch(logoutUser());
    }
  };

  return {
    isAuthenticated,
    user,
    deconnectionLoading,
    initialize,
    login,
    logout,
  };
};
