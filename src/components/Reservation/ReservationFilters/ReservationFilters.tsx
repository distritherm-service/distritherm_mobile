import React, { useCallback } from "react";
import { EReservationStatus, ReservationFilter } from "src/types/Reservation";
import ReservationFiltersPresenter from "./ReservationFiltersPresenter";

interface ReservationFiltersProps {
  activeFilter: ReservationFilter;
  onFilterChange: (filter: ReservationFilter) => void;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filterOptions: { key: ReservationFilter; label: string }[] = [
    { key: "ALL", label: "Toutes" },
    { key: EReservationStatus.CONFIRMED, label: "Confirmées" },
    { key: EReservationStatus.PICKED_UP, label: "Récupérées" },
    { key: EReservationStatus.CANCELLED, label: "Annulées" },
  ];

  const handleFilterPress = useCallback((filter: ReservationFilter) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  return (
    <ReservationFiltersPresenter
      filterOptions={filterOptions}
      activeFilter={activeFilter}
      onFilterPress={handleFilterPress}
    />
  );
};

export default ReservationFilters; 