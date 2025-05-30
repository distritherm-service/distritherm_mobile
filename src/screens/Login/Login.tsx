import React, { useState } from 'react'
import LoginPresenter from './LoginPresenter'
import { useForm } from 'react-hook-form';
import { LoginFormData, validationRules } from 'src/types/AuthTypes';
import { useNavigation } from '@react-navigation/native';
import authService, { RegularLoginDto } from 'src/services/authService';
import { Alert } from 'react-native';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigation();

  // Form setup with react-hook-form
  const { control, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // Watch form values for real-time validation feedback
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
      
     console.log(response);
      
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPresenter 
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      error={error}
      validationRules={validationRules}
    />
  )
}

export default Login