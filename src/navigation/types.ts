// Types pour la navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type SearchParams = {
  status?: "onTyping" | "onSearch";
  filter?: {
    categoryId?: number;
    categoryName?: string;
    [key: string]: any;
  };
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