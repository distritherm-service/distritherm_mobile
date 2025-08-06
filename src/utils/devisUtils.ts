/**
 * Utilitaires pour les devis
 */

import { Devis } from '../types/Devis';

/**
 * Calcule le total HT d'un devis à partir de son panier
 */
export const calculateDevisTotalHt = (devis: Devis): number => {
  if (!devis.cart?.cartItems || devis.cart.cartItems.length === 0) {
    return 0;
  }

  return devis.cart.cartItems.reduce((total, item) => {
    const priceHt = Number(item.priceHt) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (priceHt * quantity);
  }, 0);
};

/**
 * Calcule le total TTC d'un devis à partir de son panier
 */
export const calculateDevisTotalTtc = (devis: Devis): number => {
  if (!devis.cart?.cartItems || devis.cart.cartItems.length === 0) {
    return 0;
  }

  return devis.cart.cartItems.reduce((total, item) => {
    const priceTtc = Number(item.priceTtc) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (priceTtc * quantity);
  }, 0);
};

/**
 * Calcule les totaux d'un devis (HT et TTC)
 */
export const calculateDevisTotals = (devis: Devis) => {
  return {
    totalHt: calculateDevisTotalHt(devis),
    totalTtc: calculateDevisTotalTtc(devis)
  };
};