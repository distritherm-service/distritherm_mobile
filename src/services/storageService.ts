import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { User } from "src/types/User";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  IS_AUTHENTICATED: "is_authenticated",
} as const;

const SECURE_KEYS = {
  REFRESH_TOKEN: "secure_refresh_token",
} as const;

class StorageService {
  // User Data
  async setUserData(userData: User) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
  }

  async getUserData(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  // Tokens
  async setAccessToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async getAccessToken() {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // 🔐 REFRESH TOKEN SÉCURISÉ (SecureStore uniquement)
  async setRefreshToken(token: string) {
    try {
      await SecureStore.setItemAsync(SECURE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      throw error; // Propager l'erreur au lieu de fallback
    }
  }

  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      return null;
    }
  }

  // Authentication State
  async setIsAuthenticated(isAuthenticated: boolean) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_AUTHENTICATED,
      JSON.stringify(isAuthenticated)
    );
  }

  async getIsAuthenticated() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return data ? JSON.parse(data) : false;
  }

  // Vérification de l'existence des tokens
  async hasValidTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }

  // Clear all storage
  async clearAll() {
    try {
      // Nettoyer SecureStore (refresh token)
      await SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN).catch(() => {});
      
      // Nettoyer AsyncStorage (sans refresh token)
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.IS_AUTHENTICATED,
      ]);
    } catch (error) {
      throw error;
    }
  }
}

export default new StorageService();
