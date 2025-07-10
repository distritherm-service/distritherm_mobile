/**
 * Énumérations pour les utilisateurs
 */
export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  COMMERCIAL = 'COMMERCIAL'
}

export enum Type {
  REGULAR = 'REGULAR',
  PROVIDER = 'PROVIDER'
}

/**
 * Interface pour les informations de compte professionnel
 */
export interface UserProInfoDto {
  isPro?: boolean;
  categoryIdPro?: number;
  percentage?: number;
  categoryProName?: string;
}

/**
 * Interface de base pour un utilisateur
 */
export interface User {
  id: number;
  email: string;
  password?: string;
  role: Role;
  type: Type;
  createdAt: Date;
  firstName?: string;
  lastLogin: Date;
  lastName?: string;
  phoneNumber?: string;
  updatedAt: Date;
  urlPicture?: string;
  passwordResetToken?: string;
}

/**
 * DTO utilisateur de base
 */
export interface UserBasicDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  type: Type;
  role: Role;
  urlPicture?: string;
  proInfo?: UserProInfoDto;
}

/**
 * Interface pour un client
 */
export interface Client {
  userId: number;
  companyName?: string;
  siretNumber?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO utilisateur avec informations client
 */
export interface UserWithClientDto extends UserBasicDto {
  client?: {
    companyName?: string;
    siretNumber?: string;
    emailVerified: boolean;
  };
}

/**
 * DTO pour la mise à jour d'un utilisateur
 * Inclut les informations personnelles et les informations client
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  siretNumber?: string;
}

/**
 * Interface pour un commercial
 */
export interface Commercial {
  userId: number;
}

/**
 * DTO utilisateur avec informations commercial
 */
export interface UserWithCommercialDto extends UserBasicDto {}

/**
 * Interface pour un admin
 */
export interface Admin {
  userId: number;
}

/**
 * DTO utilisateur avec informations admin
 */
export interface UserWithAdminDto extends UserBasicDto {}
