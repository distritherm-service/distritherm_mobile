import React, { useState, useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomBarPresenter from './BottomBarPresenter';
import Home from '../../screens/Home';
import Search from '../../screens/Search';
import Favorite from '../../screens/Favorite';
import Cart from '../../screens/Cart';
import Profil from '../../screens/Profil';

/**
 * Container component for BottomBar
 * Handles business logic, data fetching, and state management
 */
const BottomBar = () => {
  const [activeTab, setActiveTab] = useState('Home');

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
    />
  );
};

export default BottomBar; 