import api from "../interceptors/api";

/**
 * DTO pour la création d'une catégorie
 */
export interface CreateCategoryDto {
  name: string;
  imageUrl?: string;
  level: number;
  alias: string;
  haveParent: boolean;
  haveChildren: boolean;
  description?: string;
  parentCategoryId?: number;
  agenceId: number;
}

/**
 * DTO pour la mise à jour d'une catégorie
 */
export interface UpdateCategoryDto {
  name?: string;
  imageUrl?: string;
  level?: number;
  alias?: string;
  haveParent?: boolean;
  haveChildren?: boolean;
  description?: string;
  parentCategoryId?: number;
  agenceId?: number;
}

const categoriesService = {
  // GET /categories - Récupérer toutes les catégories
  getAllCategories: async (): Promise<any> => {
    try {
      const response = await api.get("/categories");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/search?q=query - Rechercher des catégories
  searchCategories: async (query: string): Promise<any> => {
    try {
      const response = await api.get(`/categories/search?q=${encodeURIComponent(query)}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/count - Récupérer le nombre total de catégories
  getCategoriesCount: async (): Promise<any> => {
    try {
      const response = await api.get("/categories/count");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/agency/:agencyId - Récupérer les catégories par agence
  getCategoriesByAgency: async (agencyId: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/agency/${agencyId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/:id - Récupérer une catégorie spécifique
  getOneCategory: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/:id/children - Récupérer une catégorie avec ses enfants
  getCategoryWithChildren: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/${id}/children`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/:id/parent - Récupérer une catégorie avec son parent
  getCategoryWithParent: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/${id}/parent`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/tree/agency/:agencyId - Récupérer l'arbre des catégories par agence
  getCategoryTreeByAgency: async (agencyId: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/tree/agency/${agencyId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/tree - Récupérer l'arbre complet des catégories
  getCategoryTree: async (): Promise<any> => {
    try {
      const response = await api.get("/categories/tree");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /categories/level/:level - Récupérer les catégories par niveau
  getCategoriesByLevel: async (level: number): Promise<any> => {
    try {
      const response = await api.get(`/categories/level/${level}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default categoriesService; 