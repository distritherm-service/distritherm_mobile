/**
 * Interface pour une promotion
 */
export interface Promotion {
  id: number;
  reductionPercentage: number;
  endDate: Date;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
} 