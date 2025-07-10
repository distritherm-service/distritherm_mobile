import api from "../interceptors/api";

export interface ProAccountRequestDto {
  companyName: string;
  siretNumber: string;
  activitySector: string;
  additionalInfo?: string;
  contactPhone: string;
}

export interface ProAccountRequestResponse {
  success: boolean;
  message: string;
  requestId?: number;
}

export interface ProAccountPostulationDto {
  id: number;
  userId: number;
  categoryName: string;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    urlPicture?: string;
  };
}

export interface CreateProAccountPostulationDto {
  userId?: number;
  categoryName: string;
}

export interface CreateProAccountPostulationResponse {
  message: string;
  postulation: ProAccountPostulationDto;
}

export interface GetProAccountPostulationsResponse {
  message: string;
  postulations: ProAccountPostulationDto[];
}

export interface DeleteProAccountPostulationResponse {
  message: string;
  postulationId: number;
}

const proAccountService = {
  // POST /pro-account/request - Demander un compte professionnel
  requestProAccount: async (requestDto: ProAccountRequestDto): Promise<ProAccountRequestResponse> => {
    try {
      const response = await api.post("/pro-account/request", requestDto);
      return response.data as ProAccountRequestResponse;
    } catch (error) {
      throw error;
    }
  },

  // CRUD pour les postulations de compte professionnel

  // POST /pro-account/postulations - Créer une postulation
  createPostulation: async (postulationDto: CreateProAccountPostulationDto): Promise<CreateProAccountPostulationResponse> => {
    try {
      const response = await api.post("/pro-account/postulations", postulationDto);
      return response.data as CreateProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },

  // GET /pro-account/postulations - Récupérer toutes les postulations (Admin seulement)
  getAllPostulations: async (): Promise<GetProAccountPostulationsResponse> => {
    try {
      const response = await api.get("/pro-account/postulations");
      return response.data as GetProAccountPostulationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // GET /pro-account/postulations/users/:userId - Récupérer les postulations d'un utilisateur
  getPostulationsByUser: async (userId: number): Promise<GetProAccountPostulationsResponse> => {
    try {
      const response = await api.get(`/pro-account/postulations/users/${userId}`);
      return response.data as GetProAccountPostulationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /pro-account/postulations/:id - Supprimer une postulation
  deletePostulation: async (postulationId: number): Promise<DeleteProAccountPostulationResponse> => {
    try {
      const response = await api.delete(`/pro-account/postulations/${postulationId}`);
      return response.data as DeleteProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },
};

export default proAccountService; 