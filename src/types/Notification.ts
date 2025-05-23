/**
 * Interface pour une notification
 */
export interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  userId: number;
  createdAt: Date;
} 