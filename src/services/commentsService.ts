import api from "../interceptors/api";
import { PaginationDto } from "../types/PaginationDto";

// DTOs et interfaces pour les commentaires
interface CreateCommentDto {
  comment: string;
  status?: 'PENDING' | 'VALIDED' | 'DENIED';
  star: number;
  userId: number;
  productId: number;
}



type CommentStatus = 'PENDING' | 'VALIDED' | 'DENIED';

const commentsService = {
  // POST /comments - Créer un nouveau commentaire
  createComment: async (createCommentDto: CreateCommentDto): Promise<any> => {
    try {
      const response = await api.post("/comments", createCommentDto);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /comments - Récupérer tous les commentaires (admin)
  getAllComments: async (status?: CommentStatus, paginationDto?: PaginationDto): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (paginationDto?.page) params.append('page', paginationDto.page.toString());
      if (paginationDto?.limit) params.append('limit', paginationDto.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/comments?${queryString}` : '/comments';
      
      const response = await api.get(url);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /comments/count-by-status - Compter les commentaires par statut (admin)
  getCountByStatus: async (): Promise<any> => {
    try {
      const response = await api.get("/comments/count-by-status");
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /comments/by-product/:productId - Récupérer les commentaires d'un produit (public)
  getCommentsByProduct: async (productId: number, paginationDto?: PaginationDto): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page) params.append('page', paginationDto.page.toString());
      if (paginationDto?.limit) params.append('limit', paginationDto.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/comments/by-product/${productId}?${queryString}` : `/comments/by-product/${productId}`;
      
      const response = await api.get(url);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /comments/by-user/:userId - Récupérer les commentaires d'un utilisateur (admin)
  getCommentsByUser: async (userId: number, status?: CommentStatus, paginationDto?: PaginationDto): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (paginationDto?.page) params.append('page', paginationDto.page.toString());
      if (paginationDto?.limit) params.append('limit', paginationDto.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/comments/by-user/${userId}?${queryString}` : `/comments/by-user/${userId}`;
      
      const response = await api.get(url);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /comments/:id - Récupérer un commentaire spécifique (public)
  getCommentById: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/comments/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /comments/:id - Mettre à jour le statut d'un commentaire (admin)
  updateCommentStatus: async (id: number, status: CommentStatus): Promise<any> => {
    try {
      const response = await api.put(`/comments/${id}?status=${status}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /comments/:id - Supprimer un commentaire (admin)
  deleteComment: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/comments/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default commentsService; 