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
 * Applique la logique métier : Prix pro prioritaire si utilisateur pro dans la bonne catégorie,
 * sinon prix promotion si disponible, sinon prix normal
 */
export const calculateProductPricing = (
  product: ProductBasicDto,
  userProInfo?: UserProInfoDto | null
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

  // Vérifier si l'utilisateur est pro et a droit à la réduction sur cette catégorie
  const isUserProForThisCategory = userProInfo?.isPro && 
                                   userProInfo?.categoryIdPro && 
                                   hasValidProInfo &&
                                   userProInfo.categoryIdPro === product.proInfo?.categoryIdPro;

  // RÈGLE MÉTIER : Si utilisateur pro pour cette catégorie, privilégier TOUJOURS la remise pro
  if (isUserProForThisCategory && hasValidProInfo) {
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

  // Sinon, appliquer la promotion si disponible
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

  // Aucune remise applicable
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