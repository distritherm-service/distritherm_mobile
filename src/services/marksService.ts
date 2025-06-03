import api from "../interceptors/api";

// Types et interfaces pour les DTOs
export interface CreateMarkDto {
  name: string;
}

export interface UpdateMarkDto {
  name?: string;
}

export interface MarkDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductBasicDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  // Ajoutez d'autres propriétés selon vos besoins
}

export interface MarkWithProductsDto extends MarkDto {
  products: ProductBasicDto[];
}

export interface MarkResponseDto {
  mark: MarkWithProductsDto;
  message: string;
}

export interface MarksListResponseDto {
  marks: MarkDto[];
  message: string;
}

export interface MarkCountResponseDto {
  count: number;
  message: string;
}

export interface MarkDeleteResponseDto {
  message: string;
}

const marksService = {
  // GET /marks - Récupérer toutes les marques
  findAll: async (): Promise<any> => {
    try {
      const response = await api.get("/marks");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /marks/search - Rechercher des marques par terme de recherche
  search: async (query: string): Promise<any> => {
    try {
      const response = await api.get(`/marks/search?q=${encodeURIComponent(query)}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /marks/count - Compter le nombre total de marques
  count: async (): Promise<any> => {
    try {
      const response = await api.get("/marks/count");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /marks/:id - Récupérer une marque par son ID
  findOne: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/marks/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default marksService; 