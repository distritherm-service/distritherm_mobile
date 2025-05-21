export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  type: string;
  role: string;
  client?: {
    companyName?: string;
    siretNumber?: string;
    emailVerified: boolean;
  } | undefined;
}
