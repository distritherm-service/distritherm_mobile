import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomePresenter from './HomePresenter';
import { SearchParams, RootStackParamList } from 'src/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HomeProps {
  onNavigateToSearch?: (params: SearchParams) => void;
}

const Home = ({ onNavigateToSearch }: HomeProps) => {
  const navigation = useNavigation<NavigationProp>();

  /**
   * Handles search bar press - navigate to SearchScreen
   */
  const handleSearchBarPress = useCallback(() => {
    if (onNavigateToSearch) {
      onNavigateToSearch({
        status: 'onTyping', // Start in typing mode
        filter: {} // No initial filter
      });
    }
  }, [onNavigateToSearch]);

  /**
   * Navigate directly to Categories screen
   */
  const handleNavigateToCategories = useCallback(() => {
    navigation.navigate('Categories');
  }, [navigation]);

  // Any additional state management for the HomeScreen screen can be added here
  
  return (
    <HomePresenter
      onSearchBarPress={handleSearchBarPress}
      onNavigateToSearch={onNavigateToSearch}
      onNavigateToCategories={handleNavigateToCategories}
    />
  );
};

export default Home; 