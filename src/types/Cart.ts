/**
 * Énumération pour le statut du panier
 */
export enum CartStatus {
  IS_ACTIVE = 'IS_ACTIVE',
  IS_ORDERED = 'IS_ORDERED',
  IS_DEVIS = 'IS_DEVIS',
  IS_DEVIS_AND_ORDERED = 'IS_DEVIS_AND_ORDERED'
}

/**
 * Interface pour un panier
 */
export interface Cart {
  id: number;
  status: CartStatus;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  totalPrice: number;
}

/**
 * Interface pour un élément du panier
 */
export interface CartItem {
  id: number;
  cartId: number;
  quantity: number;
  price: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
} 