import React, { useState } from 'react'
import LoginPresenter from './LoginPresenter'
import { useForm } from 'react-hook-form';
import { LoginFormData, validationRules } from 'src/types/AuthTypes';
import authService, { RegularLoginDto } from 'src/services/authService';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/types';

type LoginNavigationProp = StackNavigationProp<RootStackParamList>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation<LoginNavigationProp>();

  // Form setup with react-hook-form
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Prepare login data according to authService interface
      const loginDto: RegularLoginDto = {
        email: data.email,
        password: data.password,
      };

      // Call authService for regular login
      const response = await authService.regularLogin(loginDto);
      
      // Connexion automatique avec Redux
      await login(response.user, response.accessToken, response.refreshToken);
      
      // Petit délai pour s'assurer que l'état est bien synchronisé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirection vers la page Profil après connexion réussie
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: { initialTab: "Profil" },
          },
        ],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <LoginPresenter 
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      error={error}
      validationRules={validationRules}
      onForgotPassword={handleForgotPassword}
      showForgotPasswordModal={showForgotPasswordModal}
      onCloseForgotPasswordModal={handleCloseForgotPasswordModal}
      onBack={handleBack}
    />
  )
}

export default Login