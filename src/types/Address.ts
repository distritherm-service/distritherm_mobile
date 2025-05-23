/**
 * Interface pour une adresse
 */
export interface Address {
  id: number;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  postalCode: number;
  isFacturation: boolean;
  addressComplement?: string;
} 