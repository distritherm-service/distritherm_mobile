import api from "../interceptors/api";

// DTOs et interfaces pour les favoris
interface CreateFavoriteDto {
  productId: number;
  userId: number;
}

interface PaginationDto {
  page?: number;
  limit?: number;
}

const favoritesService = {
  // POST /favorites - Créer un nouveau favori
  createFavorite: async (
    createFavoriteDto: CreateFavoriteDto
  ): Promise<any> => {
    try {
      const response = await api.post("/favorites", createFavoriteDto);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la création du favori:", error);
      throw error;
    }
  },

  // GET /favorites/by-user/:userId - Récupérer les favoris d'un utilisateur
  getFavoritesByUser: async (
    userId: number,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const queryString = params.toString();
      const url = queryString
        ? `/favorites/by-user/${userId}?${queryString}`
        : `/favorites/by-user/${userId}`;

      const response = await api.get(url);
      return await response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des favoris de l'utilisateur:",
        error
      );
      throw error;
    }
  },

  // GET /favorites/check/:productId/users/:userId - Vérifier si un produit est en favori pour un utilisateur
  checkFavorite: async (productId: number, userId: number): Promise<any> => {
    try {
      const response = await api.get(
        `/favorites/check/${productId}/users/${userId}`
      );
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la vérification du favori:", error);
      throw error;
    }
  },

  // DELETE /favorites/:id - Supprimer un favori par son ID
  deleteFavorite: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/favorites/${id}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      throw error;
    }
  },

  // DELETE /favorites/by-product/:productId - Supprimer un favori par l'ID du produit
  deleteFavoriteByProduct: async (productId: number): Promise<any> => {
    try {
      const response = await api.delete(`/favorites/by-product/${productId}`);
      return await response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du favori par produit:",
        error
      );
      throw error;
    }
  },
};

export default favoritesService;
