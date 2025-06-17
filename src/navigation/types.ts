// Types pour la navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type SearchFilter = {
  categoryId?: number;
  categoryName?: string;
  markId?: number;
  markName?: string;
  minPrice?: number;
  maxPrice?: number;
  inPromotion?: boolean;
};

export type SearchParams = {
  status?: "onTyping" | "onSearch";
  filter?: SearchFilter;
};

export type RootStackParamList = {
  Main: { initialTab?: string; searchParams?: SearchParams } | undefined;
  Auth: { screen: keyof AuthStackParamList } | undefined;
  PersonalInformation: undefined;
  ForgotPassword: undefined;
  Product: { productId: number };
  Search: SearchParams | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 