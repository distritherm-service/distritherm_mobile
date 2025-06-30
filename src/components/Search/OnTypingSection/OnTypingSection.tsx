import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from 'src/hooks/useAuth';
import searchHistoryService from 'src/services/searchHistoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnTypingSectionPresenter from './OnTypingSectionPresenter';

interface SearchHistoryItem {
  id?: number;
  value: string;
  userId?: number;
  createdAt?: string;
}

interface OnTypingSectionProps {
  searchQuery: string;
  autoFocus?: boolean;
  isReturningFromSearch?: boolean;
  onSearch: (query: string) => void;
  onGoBack?: () => void;
}

const STORAGE_KEY = 'local_search_history';
const MAX_LOCAL_HISTORY = 10;

/**
 * Container component for OnTypingSection
 * Handles search history logic, AsyncStorage, and API calls
 */
const OnTypingSection: React.FC<OnTypingSectionProps> = ({
  searchQuery,
  autoFocus = true,
  isReturningFromSearch,
  onSearch,
  onGoBack,
}) => {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);
  
  // UI state management
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Update internal search query when prop changes
  useEffect(() => {
    setCurrentSearchQuery(searchQuery);
  }, [searchQuery]);

  // Auto-focus the input when component mounts or when returning from search
  useEffect(() => {
    if ((autoFocus || isReturningFromSearch) && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        // Set cursor at the end of the text when returning from search
        if (isReturningFromSearch && currentSearchQuery.length > 0) {
          searchInputRef.current?.setSelection(currentSearchQuery.length, currentSearchQuery.length);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [autoFocus, isReturningFromSearch, currentSearchQuery]);

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, [isAuthenticated, user]);

  /**
   * Handle focus and blur events
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  /**
   * Format time ago for search history items
   */
  const formatTimeAgo = useCallback((dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  }, []);

  /**
   * Handle search query changes
   */
  const handleSearchQueryChange = useCallback((query: string) => {
    setCurrentSearchQuery(query);
  }, []);

  /**
   * Handle clearing search query
   */
  const handleClearSearch = useCallback(() => {
    setCurrentSearchQuery("");
  }, []);

  /**
   * Load search history from API (if authenticated) or AsyncStorage (if not)
   */
  const loadSearchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      if (isAuthenticated && user?.id) {
        // Load from API for authenticated users
        const response = await searchHistoryService.getUserLastTenSearches(user.id);
        if (response.searchHistory && Array.isArray(response.searchHistory)) {
          setSearchHistory(response.searchHistory);
        } else {
          setSearchHistory([]);
        }
      } else {
        // Load from AsyncStorage for non-authenticated users
        const localHistory = await getLocalSearchHistory();
        setSearchHistory(localHistory);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      setHistoryError('Erreur lors du chargement de l\'historique');
      
      // Fallback to local storage if API fails
      if (isAuthenticated) {
        try {
          const localHistory = await getLocalSearchHistory();
          setSearchHistory(localHistory);
        } catch (localError) {
          console.error('Error loading local search history:', localError);
          setSearchHistory([]);
        }
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Get search history from AsyncStorage
   */
  const getLocalSearchHistory = async (): Promise<SearchHistoryItem[]> => {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        return Array.isArray(history) ? history : [];
      }
      return [];
    } catch (error) {
      console.error('Error getting local search history:', error);
      return [];
    }
  };

  /**
   * Save search history to AsyncStorage
   */
  const saveLocalSearchHistory = async (history: SearchHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving local search history:', error);
    }
  };

  /**
   * Add search term to history
   */
  const addToSearchHistory = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const trimmedTerm = searchTerm.trim();
    
    try {
      if (isAuthenticated && user?.id) {
        // Check if the search term already exists in user's complete search history
        const existsResult = await searchHistoryService.checkSearchTermExists(trimmedTerm);
        
        if (existsResult.exists && existsResult.searchHistoryId) {
          // If term exists, delete the old entry first to avoid duplicates
          await searchHistoryService.deleteSearchHistoryEntry(existsResult.searchHistoryId);
        }
        
        // Save to API for authenticated users
        await searchHistoryService.createSearchHistory({ value: trimmedTerm });
        // Reload history to get updated list
        await loadSearchHistory();
      } else {
        // Save to AsyncStorage for non-authenticated users
        const currentHistory = await getLocalSearchHistory();
        
        // Remove existing entry if it exists (case-insensitive)
        const filteredHistory = currentHistory.filter(item => 
          item.value.toLowerCase() !== trimmedTerm.toLowerCase()
        );
        
        // Add new entry at the beginning
        const newHistory = [
          { value: trimmedTerm, createdAt: new Date().toISOString() },
          ...filteredHistory
        ].slice(0, MAX_LOCAL_HISTORY);
        
        await saveLocalSearchHistory(newHistory);
        setSearchHistory(newHistory);
      }
    } catch (error) {
      console.error('Error adding to search history:', error);
      
      // Fallback to local storage if API fails
      if (isAuthenticated) {
        try {
          const currentHistory = await getLocalSearchHistory();
          const filteredHistory = currentHistory.filter(item => 
            item.value.toLowerCase() !== trimmedTerm.toLowerCase()
          );
          const newHistory = [
            { value: trimmedTerm, createdAt: new Date().toISOString() },
            ...filteredHistory
          ].slice(0, MAX_LOCAL_HISTORY);
          
          await saveLocalSearchHistory(newHistory);
          setSearchHistory(newHistory);
        } catch (localError) {
          console.error('Error saving to local storage:', localError);
        }
      }
    }
  }, [isAuthenticated, user, loadSearchHistory]);

  /**
   * Handle search submission
   */
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      await addToSearchHistory(query);
      onSearch(query);
    }
  }, [addToSearchHistory, onSearch]);

  /**
   * Handle search submission
   */
  const handleSubmitEditing = useCallback(() => {
    if (currentSearchQuery.trim()) {
      handleSearch(currentSearchQuery.trim());
    }
  }, [currentSearchQuery, handleSearch]);

  /**
   * Handle selecting a search history item
   */
  const handleHistoryItemPress = useCallback((item: SearchHistoryItem) => {
    handleSearch(item.value);
  }, [handleSearch]);

  /**
   * Clear search history
   */
  const clearSearchHistory = useCallback(async () => {
    try {
      if (isAuthenticated && user?.id) {
        // Clear from API for authenticated users
        await searchHistoryService.clearUserHistory(user.id);
        // Also clear local storage as fallback/cache
        await AsyncStorage.removeItem(STORAGE_KEY);
      } else {
        // Clear from AsyncStorage for non-authenticated users
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
      
      // Fallback to local storage if API fails
      if (isAuthenticated) {
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setSearchHistory([]);
        } catch (localError) {
          console.error('Error clearing local search history:', localError);
        }
      }
    }
  }, [isAuthenticated, user]);

  /**
   * Remove specific item from search history
   */
  const removeHistoryItem = useCallback(async (item: SearchHistoryItem) => {
    try {
      if (isAuthenticated && user?.id && item.id) {
        // Remove from API for authenticated users
        await searchHistoryService.deleteSearchHistoryEntry(item.id);
        await loadSearchHistory();
      } else {
        // Remove from AsyncStorage for non-authenticated users
        const currentHistory = await getLocalSearchHistory();
        const filteredHistory = currentHistory.filter(historyItem => historyItem.value !== item.value);
        await saveLocalSearchHistory(filteredHistory);
        setSearchHistory(filteredHistory);
      }
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  }, [isAuthenticated, user, loadSearchHistory]);

  return (
    <OnTypingSectionPresenter
      currentSearchQuery={currentSearchQuery}
      searchHistory={searchHistory}
      isLoadingHistory={isLoadingHistory}
      historyError={historyError}
      autoFocus={autoFocus}
      isReturningFromSearch={isReturningFromSearch}
      isFocused={isFocused}
      searchInputRef={searchInputRef}
      onSearchQueryChange={handleSearchQueryChange}
      onClearSearch={handleClearSearch}
      onSubmitEditing={handleSubmitEditing}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onHistoryItemPress={handleHistoryItemPress}
      onClearHistory={clearSearchHistory}
      onRemoveHistoryItem={removeHistoryItem}
      onRefreshHistory={loadSearchHistory}
      formatTimeAgo={formatTimeAgo}
    />
  );
};

export default OnTypingSection; 