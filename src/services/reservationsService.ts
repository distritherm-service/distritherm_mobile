import api from "../interceptors/api";
import { PaginationDto } from "../types/PaginationDto";
import { 
  EReservation, 
  EReservationStatus, 
  CreateReservationDto, 
  UpdateReservationDto 
} from "../types/Reservation";

const reservationsService = {
  // POST /reservations - Créer une nouvelle réservation
  createReservation: async (createReservationDto: CreateReservationDto): Promise<any> => {
    try {
      const response = await api.post("/reservations", createReservationDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /reservations/user/:userId - Récupérer les réservations d'un utilisateur
  getReservationsByUser: async (
    userId: number,
    status?: EReservationStatus,
    search?: string,
    paginationDto?: PaginationDto
  ): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (search) params.append("s", search);
      if (paginationDto?.page)
        params.append("page", paginationDto.page.toString());
      if (paginationDto?.limit)
        params.append("limit", paginationDto.limit.toString());

      const queryString = params.toString();
      const url = queryString
        ? `/reservations/user/${userId}?${queryString}`
        : `/reservations/user/${userId}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /reservations/:id - Récupérer une réservation par son ID
  getReservationById: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /reservations/:id - Mettre à jour une réservation
  updateReservation: async (
    id: number,
    updateReservationDto: UpdateReservationDto
  ): Promise<any> => {
    try {
      const response = await api.put(`/reservations/${id}`, updateReservationDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /reservations/:id - Supprimer une réservation par son ID
  deleteReservation: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reservationsService; 