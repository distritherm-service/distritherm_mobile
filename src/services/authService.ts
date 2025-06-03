import api from "../interceptors/api";

// Types et interfaces pour les DTOs
export interface RegularLoginDto {
  email: string;
  password: string;
}

export interface RegularRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  phoneNumber: string;
  siretNumber: string;
}
 
export interface AdditionalUserInfoDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  siretNumber?: string;
}

export interface ProviderAuthDto {
  providerAuthToken: string;
  providerName: string;
  additionalInfo?: AdditionalUserInfoDto;
}

export interface RefreshTokenResponse {
  accessToken: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

const authService = {
  // POST /auth/regular-login - Connexion standard avec email/mot de passe
  regularLogin: async (loginDto: RegularLoginDto): Promise<any> => {
    try {
      const response = await api.post("/auth/regular-login", loginDto);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /auth/regular-register - Inscription standard
  regularRegister: async (registerDto: RegularRegisterDto): Promise<any> => {
    try {
      const response = await api.post("/auth/regular-register", registerDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /auth/refresh-token - Rafraîchir le token d'accès
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await api.post(`/auth/refresh-token?refresh_token=${encodeURIComponent(refreshToken)}`, {});
      return response.data as RefreshTokenResponse;
    } catch (error) {
      throw error;
    }
  },

  // POST /auth/provider-login - Connexion via fournisseur d'identité
  providerLogin: async (providerAuthDto: ProviderAuthDto): Promise<any> => {
    try {
      const response = await api.post("/auth/provider-login", providerAuthDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /auth/provider-register - Inscription via fournisseur d'identité
  providerRegister: async (providerAuthDto: ProviderAuthDto): Promise<any> => {
    try {
      const response = await api.post("/auth/provider-register", providerAuthDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /auth/logout - Déconnexion de l'utilisateur
  logout: async (refreshToken: string): Promise<LogoutResponse> => {
    try {
      const response = await api.post(`/auth/logout?refresh_token=${encodeURIComponent(refreshToken)}`, {});
      return response.data as LogoutResponse;
    } catch (error) {
      throw error;
    }
  },
};

export default authService; 