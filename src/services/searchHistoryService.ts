import api from "../interceptors/api";

// DTOs et interfaces pour l'historique de recherche
interface CreateSearchHistoryDto {
  value: string;
  // userId est assigné automatiquement par le backend depuis le token JWT
}


const searchHistoryService = {
  // POST /search-history - Créer une nouvelle entrée d'historique de recherche
  createSearchHistory: async (searchData: CreateSearchHistoryDto): Promise<any> => {
    try {
      const response = await api.post("/search-history", searchData);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /search-history/check-exists - Vérifier si un terme de recherche existe déjà pour l'utilisateur
  checkSearchTermExists: async (searchTerm: string): Promise<{ exists: boolean; searchHistoryId?: number }> => {
    try {
      const response = await api.get("/search-history/check-exists", {
        params: { searchTerm }
      });
      return response.data as { exists: boolean; searchHistoryId?: number };
    } catch (error) {
      throw error;
    }
  },

  // GET /search-history - Récupérer tout l'historique de recherche (ADMIN uniquement)
  getAllSearchHistory: async (): Promise<any> => {
    try {
      const response = await api.get("/search-history");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /search-history/users/:id - Récupérer l'historique de recherche d'un utilisateur
  getUserSearchHistory: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/search-history/users/${userId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /search-history/users/:id/last-ten - Récupérer les 10 dernières recherches d'un utilisateur
  getUserLastTenSearches: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/search-history/users/${userId}/last-ten`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /search-history/:id - Supprimer une entrée d'historique de recherche
  deleteSearchHistoryEntry: async (searchHistoryId: number): Promise<any> => {
    try {
      const response = await api.delete(`/search-history/${searchHistoryId}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /search-history/users/:id/clear - Clear all search history for a user
  clearUserHistory: async (userId: number): Promise<any> => {
    try {
      const response = await api.delete(`/search-history/users/${userId}/clear`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default searchHistoryService; 