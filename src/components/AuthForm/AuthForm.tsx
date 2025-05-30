import { View, Text } from 'react-native'
import React, { ReactNode, useState } from 'react'
import AuthFormPresenter from './AuthFormPresenter';
import { useNavigation } from '@react-navigation/native';

interface AuthFormProps {
  error?: string;
  children?: ReactNode;
  type: 'login' | 'register';
  onSubmit?: () => void;
  isLoading?: boolean;
}

const AuthForm = ({ error, children, type, onSubmit, isLoading = false }: AuthFormProps) => {
  const navigate = useNavigation();
  const [contentHeight, setContentHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  // Calculate if content is scrollable (content height > available screen height)
  const isScrollable = contentHeight > screenHeight;

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

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleScrollContainerLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScreenHeight(height);
  };

  return (
    <AuthFormPresenter 
      error={error} 
      type={type} 
      onPressLoginRedirection={onPressLoginRedirection}
      onGoBack={onGoBack}
      onSubmit={onSubmit}
      isLoading={isLoading}
      isScrollable={isScrollable}
      onContentSizeChange={handleContentSizeChange}
      onScrollContainerLayout={handleScrollContainerLayout}
    >
      {children}
    </AuthFormPresenter>
  )
}

export default AuthForm