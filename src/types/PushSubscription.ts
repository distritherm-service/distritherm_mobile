/**
 * Interface pour un abonnement push
 */
export interface PushSubscription {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
} 