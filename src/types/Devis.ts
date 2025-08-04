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
 * Interface pour un élément de devis (snapshot du produit)
 */
export interface DevisItem {
  id: number;
  devisId: number;
  productName: string;
  categoryName: string;
  markName: string;
  quantity: number;
  priceHt: number;
  priceTtc: number;
  totalHt: number;
  totalTtc: number;
  imageUrl?: string | null;
  createdAt: Date;
}

/**
 * Interface pour un devis
 */
export interface Devis {
  id: number;
  status: DevisStatus;
  fileUrl: string;
  endDate: Date;
  commercialId: number | null;
  createdAt: Date;
  updatedAt: Date;
  cartId: number;
  totalHt: number;
  totalTtc: number;
  cart?: {
    id: number;
    user?: any;
    [key: string]: any;
  };
  commercial?: {
    id: number;
    user?: any;
    [key: string]: any;
  };
  devisItems?: DevisItem[];
} 