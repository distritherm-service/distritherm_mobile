import React, { useState, useEffect, useCallback } from 'react';
import HomePresenter from './HomePresenter';
import { SearchParams } from 'src/navigation/types';

interface HomeProps {
  onNavigateToSearch?: (params: SearchParams) => void;
}

const Home = ({ onNavigateToSearch }: HomeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Handles search query changes
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // TODO: Implémenter la logique de recherche
    // Par exemple, filtrer les services, appeler une API, etc.
    if (query.trim()) {
      console.log('🔍 Recherche pour:', query);
      // Ici vous pourriez appeler une API de recherche
      // ou filtrer des données locales
    } else {
      console.log('🔍 Recherche effacée');
      // Réinitialiser les résultats de recherche
    }
  }, []);

  // Any additional state management for the HomeScreen screen can be added here
  
  return (
    <HomePresenter
      isLoading={isLoading}
      error={error}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onNavigateToSearch={onNavigateToSearch}
    />
  );
};

export default Home; 