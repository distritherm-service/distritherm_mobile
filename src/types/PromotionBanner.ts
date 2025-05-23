/**
 * Interface pour une bannière de promotion
 */
export interface PromotionBanner {
  id: number;
  imageUrl: string;
  promotionId: number;
  createdAt: Date;
  updatedAt: Date;
} 