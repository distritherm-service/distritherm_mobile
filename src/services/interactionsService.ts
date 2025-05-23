import api from "../interceptors/api";

// DTOs et interfaces pour les interactions
interface CreateInteractionDto {
  type: 'CLICK_PRODUCT' | 'VIEW_PRODUCT' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'PURCHASE' | 'SEARCH';
  productId: number;
  userId: number;
}

interface ProductBasicDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  providerId: number;
}

interface InteractionTypeStatDto {
  type: string;
  _count: number;
}

interface PopularProductStatDto {
  product: ProductBasicDto;
  count: number;
}


const interactionsService = {
  // POST /interactions - Créer une nouvelle interaction
  createInteraction: async (createInteractionDto: CreateInteractionDto): Promise<any> => {
    try {
      const response = await api.post("/interactions", createInteractionDto);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'interaction:", error);
      throw error;
    }
  },
};

export default interactionsService; 