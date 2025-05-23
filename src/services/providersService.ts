import api from "../interceptors/api";

interface ProviderDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const providersService = {
  // GET /providers - Récupérer tous les fournisseurs (PUBLIC)
  getAllProviders: async (): Promise<any> => {
    try {
      const response = await api.get("/providers");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs:", error);
      throw error;
    }
  },

  // GET /providers/:id - Récupérer un fournisseur spécifique (PUBLIC)
  getOneProvider: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/providers/${id}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du fournisseur:", error);
      throw error;
    }
  },
};

export default providersService; 