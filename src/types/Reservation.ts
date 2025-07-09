/**
 * Énumération pour le statut des réservations
 */
export enum EReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED'
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
  createdAt: Date;
  updatedAt: Date;
  cart?: {
    id: number;
    cartItems?: any[];
    [key: string]: any;
  };
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

/**
 * Interface pour le filtre des réservations
 */
export type ReservationFilter = 'ALL' | EReservationStatus; 