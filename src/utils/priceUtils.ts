import { ProductBasicDto, ProductProInfoDto } from '../types/Product';
import { UserProInfoDto } from '../types/User';

export interface DiscountInfo {
  type: 'pro' | 'promotion' | null;
  percentage: number | null;
  discountedPriceHt: number;
  discountedPriceTtc: number;
  originalPriceHt: number;
  originalPriceTtc: number;
  isApplicable: boolean;
  savings: number; // Économies réalisées en HT
}

/**
 * Calcule les informations de prix et de remise pour un produit
 * Applique la logique métier selon l'ordre de priorité :
 * 1. Prix pro (proInfoReduction) si le produit a proInfo ET sa catégorie correspond
 * 2. Sinon promotion si disponible
 * 3. Sinon prix normal
 * 
 * @example
 * // Exemple avec le produit du log utilisateur :
 * const product = {
 *   categoryId: 20,           // Catégorie "Clôture"
 *   priceHt: 39.99,
 *   priceTtc: 47.99,
 *   proInfo: {
 *     categoryIdPro: 12,      // Catégorie pro "Sanitaires" 
 *     percentage: 10,
 *     proPriceHt: 35.99,
 *     proPriceTtc: 43.19,
 *     isPro: true
 *   },
 *   isInPromotion: false,
 *   promotionPrice: null,
 *   promotionPercentage: null
 * };
 * 
 * // Résultat attendu : 20 ≠ 12 → Pas de réduction pro → Pas de promotion → Prix normal
 * const result = calculateProductPricing(product);
 * // result.type === null
 * // result.discountedPriceHt === 39.99 (prix normal)
 */
export const calculateProductPricing = (
  product: ProductBasicDto,
  userProInfo?: UserProInfoDto | null // Paramètre gardé pour compatibilité mais non utilisé
): DiscountInfo => {
  const originalPriceHt = product.priceHt;
  const originalPriceTtc = product.priceTtc;

  // Vérifier si le produit a des informations pro valides
  const hasValidProInfo = product.proInfo?.isPro && 
                         product.proInfo?.percentage && 
                         product.proInfo?.proPriceHt &&
                         product.proInfo?.proPriceTtc &&
                         product.proInfo?.categoryIdPro;

  // Vérifier si le produit a une promotion valide
  const hasValidPromotion = product.isInPromotion && 
                           product.promotionPrice && 
                           product.promotionPercentage &&
                           product.promotionEndDate &&
                           new Date(product.promotionEndDate) > new Date();

  // RÈGLE MÉTIER PRIORITÉ 1 : Vérifier si la catégorie du produit correspond à la catégorie pro
  // On compare directement product.categoryId avec product.proInfo.categoryIdPro
  const isProApplicableForThisCategory = hasValidProInfo &&
                                        product.categoryId === product.proInfo?.categoryIdPro;

  // Si proInfo s'applique à cette catégorie, privilégier TOUJOURS la remise pro
  if (isProApplicableForThisCategory && hasValidProInfo) {
    const discountedPriceHt = product.proInfo!.proPriceHt!;
    const discountedPriceTtc = product.proInfo!.proPriceTtc!;
    const savings = originalPriceHt - discountedPriceHt;

    return {
      type: 'pro',
      percentage: product.proInfo!.percentage!,
      discountedPriceHt,
      discountedPriceTtc,
      originalPriceHt,
      originalPriceTtc,
      isApplicable: true,
      savings
    };
  }

  // RÈGLE MÉTIER PRIORITÉ 2 : Appliquer la promotion si disponible et pas de proInfo applicable
  if (hasValidPromotion) {
    const discountedPriceTtc = product.promotionPrice!;
    const discountedPriceHt = discountedPriceTtc / 1.20; // Conversion TTC vers HT
    const savings = originalPriceHt - discountedPriceHt;

    return {
      type: 'promotion',
      percentage: product.promotionPercentage!,
      discountedPriceHt,
      discountedPriceTtc,
      originalPriceHt,
      originalPriceTtc,
      isApplicable: true,
      savings
    };
  }

  // RÈGLE MÉTIER PRIORITÉ 3 : Aucune remise applicable, prix normal
  return {
    type: null,
    percentage: null,
    discountedPriceHt: originalPriceHt,
    discountedPriceTtc: originalPriceTtc,
    originalPriceHt,
    originalPriceTtc,
    isApplicable: false,
    savings: 0
  };
};

/**
 * Formate un prix en euros avec les règles françaises
 */
export const formatPrice = (price: number, currency: 'EUR' = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Calcule le prix total pour une quantité donnée
 */
export const calculateTotalPrice = (unitPrice: number, quantity: number): number => {
  return unitPrice * quantity;
};

/**
 * Détermine si un produit a un stock suffisant
 */
export const hasStockAvailable = (product: ProductBasicDto, requestedQuantity: number = 1): boolean => {
  return product.quantity >= requestedQuantity;
};

/**
 * Détermine si un produit a un stock faible (seuil configurable)
 */
export const isLowStock = (product: ProductBasicDto, threshold: number = 5): boolean => {
  return product.quantity > 0 && product.quantity <= threshold;
};

/**
 * Retourne le badge et les styles appropriés pour le type de remise
 */
export const getDiscountBadgeInfo = (discountType: 'pro' | 'promotion' | null) => {
  switch (discountType) {
    case 'pro':
      return {
        icon: '👨‍💼',
        label: 'PRIX PRO',
        colorScheme: 'success'
      };
    case 'promotion':
      return {
        icon: '🔥',
        label: 'PROMO',
        colorScheme: 'accent'
      };
    default:
      return null;
  }
}; 