import api from "../interceptors/api";
import { UserWithClientDto, UpdateUserDto } from "src/types/User";

// DTOs et interfaces pour les utilisateurs
interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: string;
}

interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface SendUpdatePasswordForgotDto {
  email: string;
}

interface ConfirmUpdatePasswordForgotDto {
  password: string;
}

interface ResendVerificationEmailDto {
  email: string;
}

interface RemindMeDto {
  fullName: string;
  phoneNumber: string;
}

interface PaginationDto {
  page?: number;
  limit?: number;
  search?: string;
}

const usersService = {
  // GET /users/verify-email - Vérifier l'email avec un token
  verifyEmail: async (token: string): Promise<any> => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /users/me - Récupérer les informations de l'utilisateur connecté
  getCurrentUser: async (): Promise<UserWithClientDto> => {
    try {
      const response = await api.get("/users/me");
      return response.data as UserWithClientDto;
    } catch (error) {
      throw error;
    }
  },

  // GET /users/:id - Récupérer un utilisateur par son ID avec ses informations client
  getUserById: async (userId: number): Promise<UserWithClientDto> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data as UserWithClientDto;
    } catch (error) {
      throw error;
    }
  },

  // PUT /users/:id - Mettre à jour un utilisateur
  updateUser: async (userId: number, updateData: UpdateUserDto): Promise<UserWithClientDto> => {
    try {
      const response = await api.put(`/users/${userId}`, updateData);
      return response.data as UserWithClientDto;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /users/:id - Supprimer un utilisateur
  deleteUser: async (userId: number): Promise<any> => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /users/send-update-password-forgot - Envoyer un email de réinitialisation de mot de passe
  sendPasswordResetEmail: async (emailData: SendUpdatePasswordForgotDto): Promise<any> => {
    try {
      const response = await api.post("/users/send-update-password-forgot", emailData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /users/update-password-forgot - Confirmer la réinitialisation du mot de passe
  confirmPasswordReset: async (token: string, passwordData: ConfirmUpdatePasswordForgotDto): Promise<any> => {
    try {
      const response = await api.post(`/users/update-password-forgot?token=${token}`, passwordData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /users/update-password - Mettre à jour le mot de passe
  updatePassword: async (passwordData: UpdatePasswordDto): Promise<any> => {
    try {
      const response = await api.post("/users/update-password", passwordData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /users/resend-verification-email - Renvoyer l'email de vérification
  resendVerificationEmail: async (emailData: ResendVerificationEmailDto): Promise<any> => {
    try {
      const response = await api.post("/users/resend-verification-email", emailData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /users/remind-me - Envoyer une demande de rappel
  sendRemindMe: async (remindData: RemindMeDto): Promise<any> => {
    try {
      const response = await api.post("/users/remind-me", remindData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default usersService; 