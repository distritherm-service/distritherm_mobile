import api from "../interceptors/api";

// DTOs et interfaces pour les notifications
interface PushSubscriptionDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PaginationDto {
  page?: number;
  limit?: number;
}

const notificationsService = {
  // GET /notifications/user/:userId - Récupérer les notifications d'un utilisateur
  getUserNotifications: async (userId: number, paginationDto?: PaginationDto): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (paginationDto?.page) params.append('page', paginationDto.page.toString());
      if (paginationDto?.limit) params.append('limit', paginationDto.limit.toString());
      
      const queryString = params.toString();
      const url = `/notifications/user/${userId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw error;
    }
  },

  // GET /notifications/user/:userId/unread-count - Compter les notifications non lues
  getUnreadNotificationsCount: async (userId: number): Promise<any> => {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors du comptage des notifications non lues:", error);
      throw error;
    }
  },

  // PATCH /notifications/:id/mark-as-read - Marquer une notification comme lue
  markNotificationAsRead: async (notificationId: number): Promise<any> => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/mark-as-read`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
      throw error;
    }
  },

  // DELETE /notifications/:id - Supprimer une notification
  deleteNotification: async (notificationId: number): Promise<any> => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  },

  // DELETE /notifications/delete-all/:userId - Supprimer toutes les notifications d'un utilisateur
  deleteAllUserNotifications: async (userId: number): Promise<any> => {
    try {
      const response = await api.delete(`/notifications/delete-all/${userId}`);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les notifications:", error);
      throw error;
    }
  },

  // GET /notifications/vapid-public-key - Récupérer la clé publique VAPID
  getVapidPublicKey: async (): Promise<any> => {
    try {
      const response = await api.get("/notifications/vapid-public-key");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la clé publique VAPID:", error);
      throw error;
    }
  },

  // POST /notifications/subscribe - S'abonner aux notifications push
  subscribeToNotifications: async (subscription: PushSubscriptionDto): Promise<any> => {
    try {
      const response = await api.post("/notifications/subscribe", subscription);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de l'abonnement aux notifications:", error);
      throw error;
    }
  },

  // DELETE /notifications/unsubscribe - Se désabonner des notifications push
  unsubscribeFromNotifications: async (endpoint: string): Promise<any> => {
    try {
      const response = await api.request({
        method: 'DELETE',
        url: '/notifications/unsubscribe',
        data: { endpoint }
      });
      return await response.data;
    } catch (error) {
      console.error("Erreur lors du désabonnement des notifications:", error);
      throw error;
    }
  },

  // GET /notifications/subscriptions - Récupérer les abonnements de l'utilisateur
  getUserSubscriptions: async (): Promise<any> => {
    try {
      const response = await api.get("/notifications/subscriptions");
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des abonnements:", error);
      throw error;
    }
  },
};

export default notificationsService; 