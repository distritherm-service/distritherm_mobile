/**
 * Énumération pour le statut des commentaires
 */
export enum CommentStatus {
  PENDING = 'PENDING',
  VALIDED = 'VALIDED',
  DENIED = 'DENIED'
}

/**
 * Interface pour un commentaire
 */
export interface Comment {
  id: number;
  comment: string;
  userId: number;
  createdAt: Date;
  productId: number;
  star: number;
  status: CommentStatus;
} 