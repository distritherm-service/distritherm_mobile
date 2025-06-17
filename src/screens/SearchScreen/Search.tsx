import React, { useState, useEffect } from "react";
import SearchPresenter from "./SearchPresenter";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, SearchFilter } from "src/navigation/types";

type SearchScreenRouteProp = RouteProp<RootStackParamList, "Search">;

interface SearchProps {
  route?: SearchScreenRouteProp;
}

/**
 * Container component for Search
 * Handles business logic, data fetching, and state management
 */
const Search = ({ route }: SearchProps) => {
  const [status, setStatus] = useState<"onTyping" | "onSearch">(
    route?.params?.status || "onTyping"
  );
  const [filter, setFilter] = useState(route?.params?.filter || {});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isReturningFromSearch, setIsReturningFromSearch] = useState(false);

  // Update status and filter when route params change
  useEffect(() => {
    if (route?.params?.status) {
      setStatus(route.params.status);
      // Reset search query when status changes to onTyping
      if (route.params.status === 'onTyping') {
        setSearchQuery("");
      }
    }
    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route?.params]);

  const handleStatusChange = (newStatus: "onTyping" | "onSearch") => {
    setStatus(newStatus);
  };

  const handleFilterChange = (newFilter: SearchFilter) => {
    setFilter(newFilter);
  };

  /**
   * Handle search submission - switch to search mode
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setStatus("onSearch");
  };

  /**
   * Handle back to typing mode
   */
  const handleBackToTyping = () => {
    setIsReturningFromSearch(true);
    setStatus("onTyping");
    // Reset the flag after a short delay
    setTimeout(() => setIsReturningFromSearch(false), 250);
  };

  return (
    <SearchPresenter
      status={status}
      filter={filter}
      searchQuery={searchQuery}
      isReturningFromSearch={isReturningFromSearch}
      onStatusChange={handleStatusChange}
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      onBackToTyping={handleBackToTyping}
    />
  );
};

export default Search;
