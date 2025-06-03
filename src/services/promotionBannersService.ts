import api from "../interceptors/api";

// Types et interfaces pour les DTOs
export interface CreatePromotionBannerDto {
  imageUrl: string;
  promotionId: number;
}

export interface UpdatePromotionBannerDto {
  imageUrl?: string;
  promotionId?: number;
}

export interface PromotionDto {
  id: number;
  reductionPercentage: number;
  endDate: Date;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionBannerDto {
  id: number;
  imageUrl: string;
  promotionId: number;
  createdAt: Date;
  updatedAt: Date;
  promotion?: PromotionDto;
}

export interface PromotionBannerResponseDto {
  banner: PromotionBannerDto;
  message: string;
}

export interface PromotionBannersListResponseDto {
  banners: PromotionBannerDto[];
  message: string;
}

export interface PromotionBannerDeleteResponseDto {
  message: string;
}

const promotionBannersService = {
  // GET /promotion-banners - Récupérer toutes les bannières de promotion
  findAll: async (): Promise<any> => {
    try {
      const response = await api.get("/promotion-banners");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /promotion-banners/:id - Récupérer une bannière de promotion par son ID
  findOne: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/promotion-banners/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /promotion-banners/promotion/:promotionId - Récupérer une bannière par l'ID de sa promotion associée
  findByPromotionId: async (promotionId: number): Promise<any> => {
    try {
      const response = await api.get(`/promotion-banners/promotion/${promotionId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default promotionBannersService; 