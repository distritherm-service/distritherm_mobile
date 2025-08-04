import api from "../interceptors/api";

export enum ProAccountPostulationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// Interface pour la création de postulation (unifie l'ancien système)
export interface CreateProAccountPostulationDto {
  categoryName: string;
  userId?: number;
}

export interface ProAccountPostulationDto {
  id: number;
  userId: number;
  categoryName: string;
  status: ProAccountPostulationStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    urlPicture?: string;
  };
}



export interface CreateProAccountPostulationResponse {
  message: string;
  success: boolean;
  postulation: ProAccountPostulationDto;
}

export interface GetProAccountPostulationsResponse {
  message: string;
  success: boolean;
  postulations: ProAccountPostulationDto[];
  count: number;
}

export interface DeleteProAccountPostulationResponse {
  message: string;
  success: boolean;
  deletedPostulationId: number;
}

export interface UpdateProAccountPostulationDto {
  status: ProAccountPostulationStatus;
}

export interface UpdateProAccountPostulationResponse {
  message: string;
  success: boolean;
  postulationId: number;
  newStatus: ProAccountPostulationStatus;
}

// Helper function pour obtenir le libellé du statut en français
export const getPostulationStatusLabel = (status: ProAccountPostulationStatus): string => {
  switch (status) {
    case ProAccountPostulationStatus.PENDING:
      return 'En attente';
    case ProAccountPostulationStatus.APPROVED:
      return 'Approuvée';
    default:
      return 'Inconnu';
  }
};

// Helper function pour obtenir la couleur du statut
export const getPostulationStatusColor = (status: ProAccountPostulationStatus): string => {
  switch (status) {
    case ProAccountPostulationStatus.PENDING:
      return '#F59E0B'; // Orange/Amber moderne
    case ProAccountPostulationStatus.APPROVED:
      return '#10B981'; // Vert/Emerald moderne
    default:
      return '#6B7280';
  }
};

// Helper function pour obtenir l'icône du statut
export const getPostulationStatusIcon = (status: ProAccountPostulationStatus): string => {
  switch (status) {
    case ProAccountPostulationStatus.PENDING:
      return '⏳'; // Sablier
    case ProAccountPostulationStatus.APPROVED:
      return '✅'; // Check vert
    default:
      return '❓'; // Point d'interrogation
  }
};

// Helper function pour obtenir le message utilisateur selon le statut
export const getPostulationStatusMessage = (status: ProAccountPostulationStatus): string => {
  switch (status) {
    case ProAccountPostulationStatus.PENDING:
      return 'Votre demande est en cours d\'examen. Nous vous tiendrons informé(e) de l\'évolution.';
    case ProAccountPostulationStatus.APPROVED:
      return '🎉 Félicitations ! Votre compte professionnel est maintenant actif avec tous les avantages.';
    default:
      return 'Statut inconnu.';
  }
};

const proAccountService = {
  // POST /pro-account/postulations - Créer une demande de compte professionnel (unifié)
  requestProAccount: async (categoryName: string): Promise<CreateProAccountPostulationResponse> => {
    try {
      const postulationDto: CreateProAccountPostulationDto = { categoryName };
      const response = await api.post("/pro-account/postulations", postulationDto);
      return response.data as CreateProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },

  // PATCH /pro-account/postulations/:id/cancel - Annuler sa propre demande
  cancelPostulation: async (postulationId: number): Promise<UpdateProAccountPostulationResponse> => {
    try {
      const response = await api.patch(`/pro-account/postulations/${postulationId}/cancel`);
      return response.data as UpdateProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },

  // CRUD pour les postulations de compte professionnel

  // GET /pro-account/postulations - Récupérer toutes les postulations (Admin seulement)
  getAllPostulations: async (): Promise<GetProAccountPostulationsResponse> => {
    try {
      const response = await api.get("/pro-account/postulations");
      return response.data as GetProAccountPostulationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // GET /pro-account/postulations/user/:userId - Récupérer les postulations d'un utilisateur (Admin seulement)
  getPostulationsByUser: async (userId: number): Promise<GetProAccountPostulationsResponse> => {
    try {
      const response = await api.get(`/pro-account/postulations/user/${userId}`);
      return response.data as GetProAccountPostulationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // GET /pro-account/postulations/me - Récupérer ses propres postulations (utilisateur connecté)
  getMyPostulations: async (): Promise<GetProAccountPostulationsResponse> => {
    try {
      const response = await api.get("/pro-account/postulations/me");
      return response.data as GetProAccountPostulationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /pro-account/cancel/user/:userId - Annuler toutes les demandes d'un utilisateur
  cancelPostulationByUserId: async (userId: number): Promise<UpdateProAccountPostulationResponse> => {
    try {
      const response = await api.delete(`/pro-account/cancel/user/${userId}`);
      return response.data as UpdateProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /pro-account/postulations/:id/reject - Rejeter une postulation avec email (Admin seulement)
  rejectPostulation: async (postulationId: number): Promise<DeleteProAccountPostulationResponse> => {
    try {
      const response = await api.delete(`/pro-account/postulations/${postulationId}/reject`);
      return response.data as DeleteProAccountPostulationResponse;
    } catch (error) {
      throw error;
    }
  },

  // Helper method pour vérifier si l'utilisateur peut faire une demande de compte pro
  canRequestProAccount: (user: any): boolean => {
    // L'utilisateur ne peut pas faire de demande s'il est déjà pro
    if (user?.proInfo?.isPro === true) {
      return false;
    }
    return true;
  },

  // Helper method amélioré pour vérifier si l'utilisateur peut interagir avec le système de postulation
  canInteractWithProAccount: async (user: any): Promise<{ 
    canRequest: boolean; 
    canManage: boolean; 
    reason?: string;
    userStatus: 'not_pro' | 'pro_with_postulation' | 'pro_direct_validation';
    postulation?: ProAccountPostulationDto;
  }> => {
    if (!user) {
      return { 
        canRequest: false, 
        canManage: false, 
        reason: 'Utilisateur non connecté',
        userStatus: 'not_pro'
      };
    }

    try {
      // Utiliser la méthode correcte pour récupérer ses propres postulations
      const response = await proAccountService.getMyPostulations();
      const postulations = response.postulations;
      
      // Vérifier s'il y a une postulation active (PENDING ou APPROVED)
      const activePostulation = postulations.find(p => 
        p.status === ProAccountPostulationStatus.PENDING || 
        p.status === ProAccountPostulationStatus.APPROVED
      );

      // Cas 1: Utilisateur déjà pro avec postulation approved
      if (user.proInfo?.isPro === true && activePostulation?.status === ProAccountPostulationStatus.APPROVED) {
        return {
          canRequest: false,
          canManage: true,
          reason: 'Compte professionnel déjà actif via postulation',
          userStatus: 'pro_with_postulation',
          postulation: activePostulation
        };
      }

      // Cas 2: Utilisateur pro sans postulation (validation directe par admin)
      if (user.proInfo?.isPro === true && !activePostulation) {
        return {
          canRequest: false,
          canManage: false,
          reason: 'Compte professionnel activé directement par un administrateur',
          userStatus: 'pro_direct_validation'
        };
      }

      // Cas 3: Postulation en cours (PENDING)
      if (activePostulation?.status === ProAccountPostulationStatus.PENDING) {
        return {
          canRequest: false,
          canManage: true,
          reason: 'Demande en cours d\'examen',
          userStatus: 'not_pro',
          postulation: activePostulation
        };
      }

      // Cas 4: Utilisateur peut faire une nouvelle demande
      return {
        canRequest: true,
        canManage: false,
        reason: 'Peut soumettre une nouvelle demande',
        userStatus: 'not_pro'
      };
      
    } catch (error) {
      // En cas d'erreur, utiliser la logique de base
      return {
        canRequest: !user.proInfo?.isPro,
        canManage: false,
        reason: 'Erreur lors de la vérification des postulations',
        userStatus: user.proInfo?.isPro ? 'pro_direct_validation' : 'not_pro'
      };
    }
  },

  // Helper method pour vérifier si l'utilisateur peut créer une nouvelle postulation
  canCreateNewPostulation: async (userId?: number): Promise<{ canCreate: boolean; reason?: string }> => {
    try {
      // Utiliser getMyPostulations au lieu de getPostulationsByUser
      const response = await proAccountService.getMyPostulations();
      
      // Vérifier s'il y a une postulation en cours (PENDING)
      const pendingPostulation = response.postulations.find(p => p.status === ProAccountPostulationStatus.PENDING);
      if (pendingPostulation) {
        return {
          canCreate: false,
          reason: 'Vous avez déjà une demande en cours d\'examen.'
        };
      }

      // Vérifier s'il y a une postulation approuvée récente
      const approvedPostulation = response.postulations.find(p => p.status === ProAccountPostulationStatus.APPROVED);
      if (approvedPostulation) {
        return {
          canCreate: false,
          reason: 'Votre compte professionnel est déjà actif.'
        };
      }

      return { canCreate: true };
    } catch (error) {
      // En cas d'erreur, on autorise la création (fail-safe)
      return { canCreate: true };
    }
  },

  // Helper method pour vérifier si l'utilisateur a une postulation en cours
  hasActivePostulation: async (userId?: number): Promise<{ hasPostulation: boolean; postulation?: ProAccountPostulationDto }> => {
    try {
      // Utiliser getMyPostulations au lieu de getPostulationsByUser
      const response = await proAccountService.getMyPostulations();
      const activePostulation = response.postulations.find(p => 
        p.status === ProAccountPostulationStatus.PENDING || 
        p.status === ProAccountPostulationStatus.APPROVED
      );
      
      return {
        hasPostulation: !!activePostulation,
        postulation: activePostulation
      };
    } catch (error) {
      return { hasPostulation: false };
    }
  },

  // Helper method pour obtenir les statistiques des postulations d'un utilisateur
  getPostulationStats: async (userId?: number): Promise<{
    total: number;
    pending: number;
    approved: number;
    lastPostulation?: ProAccountPostulationDto;
  }> => {
    try {
      // Utiliser getMyPostulations au lieu de getPostulationsByUser
      const response = await proAccountService.getMyPostulations();
      const postulations = response.postulations;
      
      const stats = {
        total: postulations.length,
        pending: postulations.filter(p => p.status === ProAccountPostulationStatus.PENDING).length,
        approved: postulations.filter(p => p.status === ProAccountPostulationStatus.APPROVED).length,
        lastPostulation: postulations.length > 0 ? postulations[0] : undefined, // Déjà trié par date desc côté backend
      };
      
      return stats;
    } catch (error) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
      };
    }
  },

  // Helper method pour formater une date de postulation
  formatPostulationDate: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Date invalide';
    }
  },

  // Helper method pour obtenir le temps écoulé depuis la postulation
  getTimeSincePostulation: (dateString: string): string => {
    try {
      const postulationDate = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - postulationDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffDays > 0) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else if (diffMinutes > 0) {
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      } else {
        return 'À l\'instant';
      }
    } catch (error) {
      return 'Date invalide';
    }
  },

  // Helper method pour valider les données de postulation avant envoi
  validatePostulationData: (categoryName: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!categoryName?.trim()) {
      errors.push('Le nom de la catégorie est requis.');
    } else if (categoryName.trim().length < 2) {
      errors.push('Le nom de la catégorie doit contenir au moins 2 caractères.');
    } else if (categoryName.trim().length > 255) {
      errors.push('Le nom de la catégorie ne peut pas dépasser 255 caractères.');
    }

    // Validation basique pour éviter les caractères spéciaux problématiques
    const validCategoryRegex = /^[a-zA-ZÀ-ÿ\s\-\&\(\)\.]+$/;
    if (categoryName?.trim() && !validCategoryRegex.test(categoryName.trim())) {
      errors.push('Le nom de la catégorie contient des caractères non autorisés.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default proAccountService; 