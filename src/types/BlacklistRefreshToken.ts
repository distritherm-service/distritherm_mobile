/**
 * Interface pour un token de rafraîchissement en liste noire
 */
export interface BlacklistRefreshToken {
  id: number;
  refreshToken: string;
  createdAt: Date;
} 