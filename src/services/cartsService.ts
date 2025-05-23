import api from "../interceptors/api";

// Enums
export enum CartStatus {
  IS_ACTIVE = "IS_ACTIVE",
  IS_ORDERED = "IS_ORDERED",
  IS_DEVIS = "IS_DEVIS",
  IS_DEVIS_AND_ORDERED = "IS_DEVIS_AND_ORDERED",
}

// Interfaces communes
export interface CartReference {
  cartId: number;
}

export interface ProductOperation extends CartReference {
  productId: number;
}

export interface QuantityUpdate {
  quantity: number;
}

export interface CartItemReference extends CartReference {
  cartItemId: number;
}

// DTOs pour les requêtes
export interface AddProductDto extends ProductOperation, QuantityUpdate {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface RemoveProductDto extends CartReference {
  cartId: number;
  productId?: number;
  cartItemId?: number;
}

export interface UpdateCartItemDto extends CartItemReference, QuantityUpdate {
  cartId: number;
  cartItemId: number;
  quantity: number;
}

export interface UpdateCartItemInCartDto extends QuantityUpdate {
  id?: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartDto {
  status?: CartStatus;
  cartItems?: UpdateCartItemInCartDto[];
}

export interface UpdateCartStatusDto {
  status: CartStatus;
}

const cartsService = {
  // GET /carts/active/:userId - Obtenir le panier actif d'un utilisateur
  getUserActiveCart: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/carts/active/${userId}`);
      return await response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du panier actif de l'utilisateur:",
        error
      );
      throw error;
    }
  },

  // GET /carts/:id - Obtenir un panier spécifique
  getCart: async (cartId: number): Promise<any> => {
    try {
      const response = await api.get(`/carts/${cartId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      throw error;
    }
  },

  // PUT /carts/:id - Mettre à jour un panier
  updateCart: async (
    cartId: number,
    updateCartDto: UpdateCartDto
  ): Promise<any> => {
    try {
      const response = await api.put(`/carts/${cartId}`, updateCartDto);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
      throw error;
    }
  },

  // PATCH /carts/:id/status - Mettre à jour le statut d'un panier
  updateCartStatus: async (
    cartId: number,
    updateCartStatusDto: UpdateCartStatusDto
  ): Promise<any> => {
    try {
      const response = await api.patch(
        `/carts/${cartId}/status`,
        updateCartStatusDto
      );
      return await response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du panier:",
        error
      );
      throw error;
    }
  },

  // DELETE /carts/:id - Supprimer un panier
  deleteCart: async (cartId: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/carts/${cartId}`);
      return (await response.data) as { message: string };
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      throw error;
    }
  },

  // POST /carts/add-cart-item - Ajouter un produit au panier
  addCartItem: async (
    addProductDto: AddProductDto
  ): Promise<any> => {
    try {
      const response = await api.post("/carts/add-cart-item", addProductDto);
      return (await response.data);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit au panier:", error);
      throw error;
    }
  },

  // POST /carts/update-cart-item - Mettre à jour un élément du panier
  updateCartItem: async (
    updateCartItemDto: UpdateCartItemDto
  ): Promise<any> => {
    try {
      const response = await api.post(
        "/carts/update-cart-item",
        updateCartItemDto
      );
      return (await response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'élément du panier:",
        error
      );
      throw error;
    }
  },

  // POST /carts/remove-cart-item - Supprimer un produit du panier
  removeCartItem: async (
    removeProductDto: RemoveProductDto
  ): Promise<{ message: string }> => {
    try {
      const response = await api.post(
        "/carts/remove-cart-item",
        removeProductDto
      );
      return (await response.data) as { message: string };
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du produit du panier:",
        error
      );
      throw error;
    }
  },
};

export default cartsService;
