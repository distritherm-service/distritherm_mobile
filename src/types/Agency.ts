/**
 * Interface pour une agence
 */
export interface Agency {
  id: number;
  name: string;
  address: string;
  country: string;
  city: string;
  phoneNumber: string;
  postalCode: number;
  createdAt: Date;
  updatedAt: Date;
} 