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
};

export default proAccountService; 