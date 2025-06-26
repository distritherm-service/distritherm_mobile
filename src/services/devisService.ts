import api from "../interceptors/api";
import { PaginationDto } from "../types/paginationDto";

// DTOs et interfaces pour les devis
export interface CreateDeviDto {
  cartId: number;
  commercialId?: number;
}

interface PostDeviDto {
  id: number;
  fileUrl: string;
  endDate: string;
}



export type DevisStatus = "SENDED" | "PROGRESS" | "CONSULTED" | "EXPIRED";

const devisService = {
  // POST /devis - Créer un nouveau devis
  createDevis: async (createDeviDto: CreateDeviDto): Promise<any> => {
    try {
      const response = await api.post("/devis", createDeviDto);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /devis/by-client/:id - Récupérer les devis d'un client
  getDevisByClient: async (
    clientId: number,
    status?: DevisStatus,
    search?: string,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      // Note: search is ignored for regular clients - handled by backend
      if (search) params.append("s", search);
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const queryString = params.toString();
      const url = queryString
        ? `/devis/by-client/${clientId}?${queryString}`
        : `/devis/by-client/${clientId}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /devis/download/:id - Télécharger un devis par son ID
  downloadDevis: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/devis/download/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /devis/:id - Récupérer un devis par son ID
  getDevisById: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/devis/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /devis/:id - Supprimer un devis par son ID
  deleteDevis: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/devis/${id}`);
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default devisService;
