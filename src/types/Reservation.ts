/**
 * Énumération pour le statut des réservations
 */
export enum EReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED'
}

/**
 * Type pour les filtres de réservation
 */
export type ReservationFilter = "ALL" | EReservationStatus;

/**
 * Interface pour un élément de réservation (snapshot du produit)
 */
export interface ReservationItem {
  id: number;
  reservationId: number;
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
 * Interface pour une réservation
 */
export interface EReservation {
  id: number;
  cartId: number;
  status: EReservationStatus;
  pickupDate: Date;
  pickupTimeSlot: string; // ex: "09:00-12:00", "14:00-18:00"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string | null;
  totalHt: number;
  totalTtc: number;
  createdAt: Date;
  updatedAt: Date;
  cart?: {
    id: number;
    user?: any;
    [key: string]: any;
  };
  reservationItems?: ReservationItem[];
}

/**
 * DTO pour créer une réservation
 */
export interface CreateReservationDto {
  cartId: number;
  pickupDate: string; // Format ISO date string
  pickupTimeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}

/**
 * DTO pour mettre à jour une réservation
 */
export interface UpdateReservationDto {
  pickupDate?: string;
  pickupTimeSlot?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  notes?: string;
  status?: EReservationStatus;
}

 