/**
 * Interface pour l'historique de recherche
 */
export interface SearchHistory {
  id: number;
  value: string;
  userId: number;
  createdAt: Date;
} 