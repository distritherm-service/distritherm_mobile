/**
 * Énumération pour le type de token
 */
export enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

/**
 * Interface pour un fournisseur
 */
export interface Provider {
  id: number;
  name: string;
  createdAt: Date;
}

/**
 * Interface pour un fournisseur d'authentification
 */
export interface AuthProvider {
  id: number;
  accountProviderId: string;
  providerId: number;
  userId: number;
  createdAt: Date;
} 