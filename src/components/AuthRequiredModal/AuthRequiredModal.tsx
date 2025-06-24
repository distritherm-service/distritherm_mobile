import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/types';
import AuthRequiredModalPresenter from './AuthRequiredModalPresenter';

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  visible,
  onClose,
  title = "Connexion requise",
  message = "Vous devez être connecté pour ajouter des produits au panier."
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleGoToLogin = () => {
    onClose();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <AuthRequiredModalPresenter
      visible={visible}
      title={title}
      message={message}
      onClose={onClose}
      onGoToLogin={handleGoToLogin}
    />
  );
};

export default AuthRequiredModal; 