/**
 * Énumération pour le statut des commandes
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Interface pour une commande
 */
export interface Order {
  id: number;
  cartId: number;
  createdAt: Date;
  updatedAt: Date;
  devisId?: number;
  status: OrderStatus;
  factureFileUrl: string;
  deliveryAddressId?: number;
  facturationAddressId?: number;
} 