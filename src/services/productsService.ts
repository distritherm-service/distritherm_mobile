import api from "../interceptors/api";

// Types et interfaces pour les DTOs
export interface CreateProductDto {
  name: string;
  priceHt: number;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description: string;
  categoryId: number;
  markId: number;
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
  isActive: boolean;
  label?: string;
  unity?: string;
  weight?: number;
  familyCode?: string;
  ecoContributionPercentage?: number;
  ecoContributionApplication?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  priceHt?: number;
  priceTtc?: number;
  quantity?: number;
  imagesUrl?: string[];
  description?: string;
  categoryId?: number;
  markId?: number;
  itemCode?: string;
  directorWord1?: string;
  directorWord2?: string;
  designation1?: string;
  designation2?: string;
  complementDesignation?: string;
  packaging?: string;
  packagingType?: string;
  submissionFgaz?: string;
  fgazFile?: string;
  isActive?: boolean;
  label?: string;
  unity?: string;
  weight?: number;
  familyCode?: string;
  ecoContributionPercentage?: number;
  ecoContributionApplication?: boolean;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

const productsService = {
  // GET /products - Récupérer tous les produits avec pagination
  findAll: async (paginationDto?: PaginationDto): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products${params.toString() ? "?" + params.toString() : ""}`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/search - Rechercher des produits par terme de recherche
  search: async (
    query: string,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      params.append("q", query);
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(`/products/search?${params.toString()}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/count - Compter le nombre total de produits
  count: async (): Promise<any> => {
    try {
      const response = await api.get("/products/count");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/category/:id - Récupérer les produits par catégorie
  getProductsByCategory: async (
    categoryId: number,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products/category/${categoryId}${
          params.toString() ? "?" + params.toString() : ""
        }`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/mark/:id - Récupérer les produits par marque
  getProductsByMark: async (
    markId: number,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products/mark/${markId}${
          params.toString() ? "?" + params.toString() : ""
        }`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/agency/:id - Récupérer les produits par agence (nécessite authentification)
  getProductsByAgency: async (
    agencyId: number,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products/agency/${agencyId}${
          params.toString() ? "?" + params.toString() : ""
        }`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/promotions - Récupérer les produits en promotion
  getProductsWithPromotions: async (
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products/promotions${
          params.toString() ? "?" + params.toString() : ""
        }`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/promotions/expiring-soon - Récupérer les produits avec promotions expirant bientôt
  getProductsExpiringSoon: async (
    days: number = 7,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      params.append("days", days.toString());
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const response = await api.get(
        `/products/promotions/expiring-soon?${params.toString()}`
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/recommendations - Récupérer les produits recommandés
  getRecommendedProducts: async (
    excludedIds?: number[],
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (excludedIds && excludedIds.length > 0) {
        params.append("excludedIds", excludedIds.join(","));
      }
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const queryString = params.toString();
      const response = await api.get(
        `/products/recommendations${queryString ? "?" + queryString : ""}`
      );

      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/:id - Récupérer un produit par son ID
  findOne: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/products/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/verify-purchased/:productId - Vérifier si un produit a été acheté (nécessite authentification)
  verifyProductPurchased: async (productId: number): Promise<any> => {
    try {
      const response = await api.get(`/products/verify-purchased/${productId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /products/:id/similar - Récupérer les produits similaires
  getSimilarProducts: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/products/${id}/similar`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productsService;
