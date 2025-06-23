import api from "../interceptors/api";
import { PaginationDto, PaginatedResponse } from "../types/paginationDto";
import { ProductBasicDto } from "../types/Product";

// Types et interfaces pour les DTOs
export interface CreatePromotionDto {
  reductionPercentage: number;
  endDate: string;
  productId: number;
}

export interface UpdatePromotionDto {
  reductionPercentage?: number;
  endDate?: string;
  productId?: number;
}

export interface UpdatePromotionByProductDto {
  reductionPercentage?: number;
  endDate?: string;
}

export interface PromotionDto {
  id: number;
  reductionPercentage: number;
  endDate: string;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product?: ProductBasicDto;
  originalPrice?: number;
  promotionPrice?: number;
}



export interface PromotionResponseDto {
  promotion: PromotionDto;
  message: string;
}

export interface PromotionsListResponseDto {
  promotions: PromotionDto[];
  count: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
  message: string;
}

export interface PromotionCountResponseDto {
  count: number;
  message: string;
}

export interface PromotionDeleteResponseDto {
  message: string;
}

const promotionsService = {
  // GET /promotions/all - Récupérer toutes les promotions avec pagination (PUBLIC)
  findAll: async (paginationDto?: PaginationDto): Promise<PromotionsListResponseDto> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page) params.append('page', paginationDto.page.toString());
      if (paginationDto?.limit) params.append('limit', paginationDto.limit.toString());
      
      const response = await api.get<PromotionsListResponseDto>(`/promotions/all${params.toString() ? '?' + params.toString() : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /promotions/:id - Récupérer une promotion par son ID (PUBLIC)
  findOne: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/promotions/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default promotionsService; 