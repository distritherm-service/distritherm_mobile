import api from "../interceptors/api";

const agenciesService = {
  // GET /agencies - Récupérer toutes les agences
  getAllAgencies: async () => {
    try {
      const response = await api.get("/agencies");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des agences:", error);
      throw error;
    }
  },

  // GET /agencies/:agencyId - Récupérer une agence spécifique
  getOneAgency: async (agencyId: number) => {
    try {
      const response = await api.get(`/agencies/${agencyId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'agence:", error);
      throw error;
    }
  },

  // GET /agencies/search?q=query - Rechercher des agences
  searchAgencies: async (query: string) => {
    try {
      const response = await api.get(`/agencies/search?q=${encodeURIComponent(query)}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche d'agences:", error);
      throw error;
    }
  },

  // GET /agencies/count - Récupérer le nombre total d'agences
  getAgenciesCount: async () => {
    try {
      const response = await api.get("/agencies/count");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre d'agences:", error);
      throw error;
    }
  },
};

export default agenciesService;
