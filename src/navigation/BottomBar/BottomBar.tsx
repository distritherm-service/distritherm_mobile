import React, { useState, useCallback, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BottomBarPresenter from './BottomBarPresenter';
import Home from '../../screens/HomeScreen/Home';
import Cart from '../../screens/CartScreen/Cart';
import Favorite from '../../screens/FavoriteScreen/Favorite';
import Profil from '../../screens/ProfilScreen/Profil';
import Search from '../../screens/SearchScreen/Search';
import { useAuth } from '../../hooks/useAuth';


/**
 * Container component for BottomBar
 * Handles business logic, data fetching, and state management
 */
const BottomBar = () => {
  const route = useRoute();
  const params = route.params as { initialTab?: string } | undefined;
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(params?.initialTab || 'Home');

  // Check if user is authenticated and email is not verified
  const isEmailUnverified = !!(isAuthenticated && user && user.client && !user.client.emailVerified);

  // Mettre à jour l'onglet actif si les paramètres changent
  useEffect(() => {
    if (params?.initialTab) {
      setActiveTab(params.initialTab);
    }
  }, [params?.initialTab]);

  // Gestion du bouton retour sur Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeTab !== 'Home') {
          setActiveTab('Home');
          return true;
        }
        return false;
      };

      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        
        return () => {
          BackHandler.addEventListener('hardwareBackPress', () => false);
        };
      }
    }, [activeTab])
  );

  // Gestion du changement d'onglet
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Rendu des écrans en fonction de l'onglet actif
  const renderScreen = (tabName: string) => {
    switch (tabName) {
      case 'Home':
        return <Home />;
      case 'Search':
        return <Search />;
      case 'Favorite':
        return <Favorite />;
      case 'Cart':
        return <Cart />;
      case 'Profil':
        return <Profil />;
      default:
        return <Home />;
    }
  };

  return (
    <BottomBarPresenter 
      activeTab={activeTab} 
      onTabPress={handleTabPress}
      renderScreen={renderScreen}
      isEmailUnverified={isEmailUnverified}
    />
  );
};

export default BottomBar; 