import React, { useState, useCallback } from 'react';
import SearchBarPresenter from './SearchBarPresenter';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Rechercher des produits...",
  autoFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  /**
   * Handles search input changes
   */
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    // Trigger search callback with debouncing could be added here
    if (onSearch) {
      onSearch(text);
    }
  }, [onSearch]);

  /**
   * Handles search input focus
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

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

  return (
    <SearchBarPresenter
      searchQuery={searchQuery}
      isFocused={isFocused}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onSearchChange={handleSearchChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClear={handleClear}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchBar; 