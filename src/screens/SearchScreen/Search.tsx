import React, { useState } from "react";
import SearchPresenter from "./SearchPresenter";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/types";

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

  const handleStatusChange = (newStatus: "onTyping" | "onSearch") => {
    setStatus(newStatus);
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  return (
    <SearchPresenter
      status={status}
      filter={filter}
      onStatusChange={handleStatusChange}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Search;
