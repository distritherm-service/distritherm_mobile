import React, { useState, useCallback, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomBarPresenter from './BottomBarPresenter';
import Home from '../../screens/HomeScreen/Home';
import Cart from '../../screens/CartScreen/Cart';
import Favorite from '../../screens/FavoriteScreen/Favorite';
import Profil from '../../screens/ProfilScreen/Profil';
import { useAuth } from '../../hooks/useAuth';
import Search from 'src/screens/SearchScreen/Search';
import { SearchParams, RootStackParamList } from 'src/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Container component for BottomBar
 * Handles business logic, data fetching, and state management
 */
const BottomBar = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const params = route.params as { initialTab?: string; searchParams?: SearchParams } | undefined;
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(params?.initialTab || 'Home');
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(params?.searchParams);

  // Check if user is authenticated and email is not verified
  const isEmailUnverified = !!(isAuthenticated && user && user.client && !user.client.emailVerified);

  // Mettre à jour l'onglet actif si les paramètres changent
  useEffect(() => {
    if (params?.initialTab) {
      setActiveTab(params.initialTab);
    }
    if (params?.searchParams) {
      setSearchParams(params.searchParams);
    }
  }, [params?.initialTab, params?.searchParams]);

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
    // Clear search params when switching tabs (except when going to Search)
    if (tabName !== 'Search') {
      setSearchParams(undefined);
    } else {
      // Reset search to onTyping mode when clicking Search tab
      setSearchParams({
        status: 'onTyping',
        filter: {}
      });
    }
  };

  // Function to navigate to search with parameters
  const navigateToSearch = (params: SearchParams) => {
    setSearchParams(params);
    setActiveTab('Search');
  };

  // Rendu des écrans en fonction de l'onglet actif
  const renderScreen = (tabName: string) => {
    switch (tabName) {
      case 'Home':
        return (
          <Home 
            onNavigateToSearch={navigateToSearch} 
          />
        );
      case 'Search':
        return <Search route={{ params: searchParams } as any} />;
      case 'Favorite':
        return <Favorite />;
      case 'Cart':
        return <Cart />;
      case 'Profil':
        return <Profil />;
      default:
        return (
          <Home 
            onNavigateToSearch={navigateToSearch} 
          />
        );
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