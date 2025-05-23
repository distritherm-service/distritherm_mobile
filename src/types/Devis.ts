/**
 * Énumération pour le statut des devis
 */
export enum DevisStatus {
  SENDED = 'SENDED',
  CONSULTED = 'CONSULTED',
  PROGRESS = 'PROGRESS',
  EXPIRED = 'EXPIRED'
}

/**
 * Interface pour un devis
 */
export interface Devis {
  id: number;
  status: DevisStatus;
  fileUrl: string;
  endDate: Date;
  commercialId: number;
  createdAt: Date;
  updatedAt: Date;
  cartId: number;
} 