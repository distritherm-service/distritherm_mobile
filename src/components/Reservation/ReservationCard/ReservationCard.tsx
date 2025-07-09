import React, { useCallback } from "react";
import { Alert } from "react-native";
import { EReservation, EReservationStatus } from "src/types/Reservation";
import ReservationCardPresenter from "./ReservationCardPresenter";

interface ReservationCardProps {
  reservation: EReservation;
  onCancel: (reservationId: number) => void;
  onViewProducts: (reservation: EReservation) => void;
  isCancelling: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onViewProducts,
  isCancelling,
}) => {
  const getStatusText = useCallback((status: EReservationStatus): string => {
    switch (status) {
      case EReservationStatus.CONFIRMED:
        return "Confirmée";
      case EReservationStatus.PICKED_UP:
        return "Récupérée";
      case EReservationStatus.CANCELLED:
        return "Annulée";
      default:
        return status;
    }
  }, []);

  const getStatusColor = useCallback((status: EReservationStatus): string => {
    switch (status) {
      case EReservationStatus.CONFIRMED:
        return "#10B981"; // Green
      case EReservationStatus.PICKED_UP:
        return "#3B82F6"; // Blue
      case EReservationStatus.CANCELLED:
        return "#EF4444"; // Red
      default:
        return "#6B7280"; // Gray
    }
  }, []);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Annuler la réservation",
      "Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Annuler la réservation",
          style: "destructive",
          onPress: () => onCancel(reservation.id),
        },
      ]
    );
  }, [reservation.id, onCancel]);

  const handleViewProducts = useCallback(() => {
    onViewProducts(reservation);
  }, [reservation, onViewProducts]);

  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }, []);

  const formatDateTime = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }, []);

  return (
    <ReservationCardPresenter
      reservation={reservation}
      onCancel={handleCancel}
      onViewProducts={handleViewProducts}
      isCancelling={isCancelling}
      getStatusText={getStatusText}
      getStatusColor={getStatusColor}
      formatDate={formatDate}
      formatDateTime={formatDateTime}
    />
  );
};

export default ReservationCard; 