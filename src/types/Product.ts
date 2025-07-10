/**
 * Interface de base pour un produit
 */
export interface Product {
  id: number;
  name: string;
  priceHt: number;
  priceTtc: number;
  quantity: number;
  description: string;
  categoryId: number;
  markId: number;
  createdAt: Date;
  updatedAt: Date;
  imagesUrl: any; // JSON field
}

/**
 * Interface pour les détails d'un produit
 */
export interface ProductDetail extends Product {
  itemCode: string;
  directorWord1?: string;
  directorWord2?: string;
  designation1?: string;
  designation2?: string;
  complementDesignation?: string;
  packaging?: string;
  packagingType?: string;
  submissionFgaz?: string;
  fgazFile?: string;
  active: boolean;
  label?: string;
  unity?: string;
  weight?: number;
  familyCode?: string;
  ecoContributionPercentage?: number;
  ecoContributionApplication?: boolean;
}

/**
 * Interface pour les informations de remise professionnelle sur un produit
 */
export interface ProductProInfoDto {
  isPro?: boolean;
  categoryIdPro?: number;
  percentage?: number;
  categoryProName?: string;
  proPriceHt?: number;
  proPriceTtc?: number;
}

/**
 * DTO produit de base
 */
export interface ProductBasicDto {
  id: number;
  name: string;
  priceHt: number;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description: string;
  categoryId: number;
  markId: number;
  unity?: string;
  category?: {
    id: number;
    name: string;
  };
  mark?: {
    id: number;
    name: string;
  };
  isInPromotion?: boolean;
  promotionPrice?: number;
  promotionEndDate?: Date;
  promotionPercentage?: number;
  isFavorited?: boolean;
  proInfo?: ProductProInfoDto | null;
}

/**
 * DTO produit détaillé
 */
export interface ProductDetailDto extends ProductBasicDto {
  priceHt: number;
  createdAt: Date;
  updatedAt: Date;
  productDetail?: ProductDetail;
} 