/**
 * Énumération pour le type d'interaction
 */
export enum InteractionType {
  CLICK_PRODUCT = 'CLICK_PRODUCT',
  SEARCH_PRODUCT = 'SEARCH_PRODUCT'
}

/**
 * Interface pour une interaction
 */
export interface Interaction {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  type: InteractionType;
} 