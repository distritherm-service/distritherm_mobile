// Types pour la navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Main: { initialTab?: string } | undefined;
  Auth: { screen: keyof AuthStackParamList } | undefined;
  PersonalInformation: undefined;
  ForgotPassword: undefined;
  Product: { productId: number }; // ← Ajouter cette ligne
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 