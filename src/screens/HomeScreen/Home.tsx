import React, { useState, useEffect, useCallback } from 'react';
import HomePresenter from './HomePresenter';
import { SearchParams } from 'src/navigation/types';

interface HomeProps {
  onNavigateToSearch?: (params: SearchParams) => void;
}

const Home = ({ onNavigateToSearch }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Handles search query changes
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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

  // Any additional state management for the HomeScreen screen can be added here
  
  return (
    <HomePresenter
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onSearchBarPress={handleSearchBarPress}
      onNavigateToSearch={onNavigateToSearch}
    />
  );
};

export default Home; 