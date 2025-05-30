import React, { useState } from 'react'
import RegisterPresenter from './RegisterPresenter'
import { useForm } from 'react-hook-form';
import { RegisterFormData, validationRules } from 'src/types/AuthTypes';
import { useNavigation } from '@react-navigation/native';
import authService, { RegularRegisterDto } from 'src/services/authService';
import { Alert } from 'react-native';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigation();

  // Form setup with react-hook-form
  const { control, handleSubmit, formState: { errors }, watch, getValues } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phoneNumber: '',
      siretNumber: '',
    },
    mode: 'onBlur',
  });

  // Watch form values for real-time validation feedback
  const watchedValues = watch();

  // Enhanced validation rules with confirm password validation
  const enhancedValidationRules = {
    ...validationRules,
    confirmPassword: {
      required: 'Please confirm your password',
      validate: (value: string) => {
        const password = getValues('password');
        return value === password || 'Passwords do not match';
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Prepare registration data according to authService interface
      const registerDto: RegularRegisterDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        phoneNumber: data.phoneNumber,
        siretNumber: data.siretNumber,
      };

      // Call authService for regular registration
      const response = await authService.regularRegister(registerDto);
      
      console.log(response);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Display error response from server
      const errorMessage = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      
      Alert.alert(
        'Registration Error',
        JSON.stringify(err?.response?.data || { error: errorMessage }, null, 2)
      );
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterPresenter 
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      error={error}
      validationRules={enhancedValidationRules}
      formErrors={errors}
      watchedValues={watchedValues}
    />
  )
}

export default Register