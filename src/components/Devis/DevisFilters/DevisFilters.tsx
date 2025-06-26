import React, { useCallback } from "react";
import { DevisStatus } from "src/types/Devis";
import DevisFiltersPresenter from "./DevisFiltersPresenter";

export type DevisFilter = "ALL" | DevisStatus;

interface DevisFiltersProps {
  activeFilter: DevisFilter;
  onFilterChange: (filter: DevisFilter) => void;
}

const DevisFilters: React.FC<DevisFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filterOptions: { key: DevisFilter; label: string }[] = [
    { key: "ALL", label: "Tous" },
    { key: DevisStatus.SENDED, label: "Envoyés" },
    { key: DevisStatus.CONSULTED, label: "Consultés" },
    { key: DevisStatus.PROGRESS, label: "En cours" },
    { key: DevisStatus.EXPIRED, label: "Expirés" },
  ];

  const handleFilterPress = useCallback((filter: DevisFilter) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  return (
    <DevisFiltersPresenter
      filterOptions={filterOptions}
      activeFilter={activeFilter}
      onFilterPress={handleFilterPress}
    />
  );
};

export default DevisFilters; 