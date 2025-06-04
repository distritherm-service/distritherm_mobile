import React, { useState } from 'react'
import LoginPresenter from './LoginPresenter'
import { useForm } from 'react-hook-form';
import { LoginFormData, validationRules } from 'src/types/AuthTypes';
import authService, { RegularLoginDto } from 'src/services/authService';
import { useAuth } from 'src/hooks/useAuth';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login } = useAuth();

  // Form setup with react-hook-form
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

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
    } catch (err: any) {
      console.log(err.response?.data?.message);
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
    />
  )
}

export default Login