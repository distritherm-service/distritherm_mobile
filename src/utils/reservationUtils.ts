/**
 * Utilitaires pour les réservations
 */

import { EReservation } from '../types/Reservation';

/**
 * Calcule le total HT d'une réservation à partir de son panier
 */
export const calculateReservationTotalHt = (reservation: EReservation): number => {
  if (!reservation.cart?.cartItems || reservation.cart.cartItems.length === 0) {
    return 0;
  }

  return reservation.cart.cartItems.reduce((total, item) => {
    const priceHt = Number(item.priceHt) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (priceHt * quantity);
  }, 0);
};

/**
 * Calcule le total TTC d'une réservation à partir de son panier
 */
export const calculateReservationTotalTtc = (reservation: EReservation): number => {
  if (!reservation.cart?.cartItems || reservation.cart.cartItems.length === 0) {
    return 0;
  }

  return reservation.cart.cartItems.reduce((total, item) => {
    const priceTtc = Number(item.priceTtc) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (priceTtc * quantity);
  }, 0);
};

/**
 * Calcule les totaux d'une réservation (HT et TTC)
 */
export const calculateReservationTotals = (reservation: EReservation) => {
  return {
    totalHt: calculateReservationTotalHt(reservation),
    totalTtc: calculateReservationTotalTtc(reservation)
  };
};