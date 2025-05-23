import api from "../interceptors/api";

// DTOs et interfaces pour l'historique de recherche
interface CreateSearchHistoryDto {
  value: string;
  userId: number;
}


const searchHistoryService = {
  // POST /search-history - Créer une nouvelle entrée d'historique de recherche
  createSearchHistory: async (searchData: Omit<CreateSearchHistoryDto, 'userId'>): Promise<any> => {
    try {
      const response = await api.post("/search-history", searchData);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'historique de recherche:", error);
      throw error;
    }
  },

  // GET /search-history - Récupérer tout l'historique de recherche (ADMIN uniquement)
  getAllSearchHistory: async (): Promise<any> => {
    try {
      const response = await api.get("/search-history");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de tout l'historique de recherche:", error);
      throw error;
    }
  },

  // GET /search-history/users/:id - Récupérer l'historique de recherche d'un utilisateur
  getUserSearchHistory: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/search-history/users/${userId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique de recherche:", error);
      throw error;
    }
  },

  // GET /search-history/users/:id/last-ten - Récupérer les 10 dernières recherches d'un utilisateur
  getUserLastTenSearches: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/search-history/users/${userId}/last-ten`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des dernières recherches:", error);
      throw error;
    }
  },

  // DELETE /search-history/:id - Supprimer une entrée d'historique de recherche
  deleteSearchHistoryEntry: async (searchHistoryId: number): Promise<any> => {
    try {
      const response = await api.delete(`/search-history/${searchHistoryId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entrée d'historique:", error);
      throw error;
    }
  },
};

export default searchHistoryService; 