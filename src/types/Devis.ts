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
 * Note: totalHt et totalTtc sont calculés côté frontend: priceHt/priceTtc * quantity
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
  imageUrl?: string | null;
  createdAt: Date;
}

/**
 * Interface pour un devis
 * Note: totalHt et totalTtc sont calculés côté frontend à partir du panier associé
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
  cart?: {
    id: number;
    user?: any;
    cartItems?: Array<{
      id: number;
      quantity: number;
      priceHt: number;
      priceTtc: number;
      product?: any;
    }>;
    [key: string]: any;
  };
  commercial?: {
    id: number;
    user?: any;
    [key: string]: any;
  };
  devisItems?: DevisItem[];
} 