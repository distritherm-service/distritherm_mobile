import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import AuthFormPresenter from './AuthFormPresenter';
import { useNavigation } from '@react-navigation/native';

interface AuthFormProps {
  error?: string;
  children: ReactNode;
  type: 'login' | 'register';
}
const AuthForm = ({ error, children, type }: AuthFormProps) => {

  const navigate = useNavigation();

  const onPressLoginRedirection = () => {
    if (type === 'login') {
      navigate.navigate('Auth', { screen: 'Register' });
    } else {
      navigate.navigate('Auth', { screen: 'Login' });
    }
  };

  const onGoBack = () => {
    navigate.reset({
      index: 0,
      routes: [{ 
        name: 'Main',
        params: { initialTab: 'Profil' }
      }],
    });
  };

  return (
    <AuthFormPresenter 
      error={error} 
      type={type} 
      onPressLoginRedirection={onPressLoginRedirection}
      onGoBack={onGoBack}
    >
      {children}
    </AuthFormPresenter>
  )
}

export default AuthForm