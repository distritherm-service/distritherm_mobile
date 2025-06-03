import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../store/store";
import {
  initializeAuth,
  loginUser,
  logoutUser,
} from "../store/features/userState";
import { User } from "../types/User";
import api from "../interceptors/api";
import storageService from "src/services/storageService";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  // 🚀 Initialiser une seule fois
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    return dispatch(loginUser({ user: userData, accessToken, refreshToken }));
  };

  const logout = async () => {
    try {
      const refreshToken = await storageService.getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
    } finally {
      return dispatch(logoutUser());
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
