import React, { useCallback, useState, useEffect } from "react";
import DevisSearchBarPresenter from "./DevisSearchBarPresenter";

interface DevisSearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const DevisSearchBar: React.FC<DevisSearchBarProps> = ({
  searchQuery,
  onSearch,
  placeholder = "Rechercher un devis...",
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearch(localQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearch]);

  // Update local state when external search query changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleTextChange = useCallback((text: string) => {
    setLocalQuery(text);
  }, []);

  const handleClear = useCallback(() => {
    setLocalQuery("");
  }, []);

  return (
    <DevisSearchBarPresenter
      searchQuery={localQuery}
      onTextChange={handleTextChange}
      onClear={handleClear}
      placeholder={placeholder}
    />
  );
};

export default DevisSearchBar; 