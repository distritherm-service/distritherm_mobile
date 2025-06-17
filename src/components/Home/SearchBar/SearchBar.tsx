import React, { useState, useCallback } from 'react';
import SearchBarPresenter from './SearchBarPresenter';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onPress,
  placeholder = "Rechercher des produits...",
  autoFocus = false,
  editable = true,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  /**
   * Handles search input changes
   */
  const handleSearchChange = useCallback((text: string) => {
    if (!editable) return;
    
    setSearchQuery(text);
    // Trigger search callback with debouncing could be added here
    if (onSearch) {
      onSearch(text);
    }
  }, [onSearch, editable]);

  /**
   * Handles search input focus
   */
  const handleFocus = useCallback(() => {
    if (!editable && onPress) {
      onPress();
      return;
    }
    setIsFocused(true);
  }, [editable, onPress]);

  /**
   * Handles search input blur
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  /**
   * Handles search clear action
   */
  const handleClear = useCallback(() => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  /**
   * Handles search submit (when user presses enter or search button)
   */
  const handleSubmit = useCallback(() => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, [onSearch, searchQuery]);

  /**
   * Handles press on the search input container
   */
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <SearchBarPresenter
      searchQuery={searchQuery}
      isFocused={isFocused}
      placeholder={placeholder}
      autoFocus={autoFocus}
      editable={editable}
      onSearchChange={handleSearchChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClear={handleClear}
      onSubmit={handleSubmit}
      onPress={handlePress}
    />
  );
};

export default SearchBar; 