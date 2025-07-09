import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCalendarCheck,
  faEye,
  faTimes,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { EReservation, EReservationStatus } from "src/types/Reservation";

interface ReservationCardPresenterProps {
  reservation: EReservation;
  onCancel: () => void;
  onViewProducts: () => void;
  isCancelling: boolean;
  getStatusText: (status: EReservationStatus) => string;
  getStatusColor: (status: EReservationStatus) => string;
  formatDate: (date: Date) => string;
  formatDateTime: (date: Date) => string;
}

const ReservationCardPresenter: React.FC<ReservationCardPresenterProps> = ({
  reservation,
  onCancel,
  onViewProducts,
  isCancelling,
  getStatusText,
  getStatusColor,
  formatDate,
  formatDateTime,
}) => {
  const colors = useColors();
  const statusColor = getStatusColor(reservation.status);

  const dynamicStyles = {
    card: {
      backgroundColor: colors.surface,
      borderRadius: ms(20),
      padding: ms(20),
      marginBottom: ms(16),
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      borderLeftWidth: 5,
      borderLeftColor: statusColor,
    },
    header: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: ms(16),
    },
    numberContainer: {
      flex: 1,
    },
    reservationNumber: {
      fontSize: ms(20),
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: ms(4),
    },
    reservationId: {
      fontSize: ms(13),
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    statusBadge: {
      paddingHorizontal: ms(14),
      paddingVertical: ms(8),
      borderRadius: ms(25),
      backgroundColor: statusColor,
      alignSelf: "flex-start" as const,
      shadowColor: statusColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    statusText: {
      fontSize: ms(12),
      fontWeight: "700" as const,
      color: colors.background,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    infoContainer: {
      marginBottom: ms(20),
    },
    infoRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: ms(10),
    },
    infoIcon: {
      width: ms(20),
      alignItems: "center" as const,
    },
    infoText: {
      fontSize: ms(14),
      color: colors.textSecondary,
      marginLeft: ms(12),
      fontWeight: "500" as const,
    },

    actionsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      paddingTop: ms(16),
      borderTopWidth: 1,
      borderTopColor: colors.border + "40",
      gap: ms(10),
    },
    actionButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: ms(16),
      paddingVertical: ms(12),
      borderRadius: ms(12),
      height: ms(48),
      flex: 1,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    viewProductsButton: {
      backgroundColor: colors.secondary[500],
      shadowColor: colors.secondary[500],
    },
    cancelButton: {
      backgroundColor: colors.danger[500],
      shadowColor: colors.danger[500],
    },
    cancelButtonDisabled: {
      backgroundColor: colors.tertiary[300],
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      fontSize: ms(13),
      fontWeight: "700" as const,
      color: colors.background,
      marginLeft: ms(8),
    },
    buttonIcon: {
      marginRight: ms(4),
    },
  };

  const canCancel = reservation.status === EReservationStatus.CONFIRMED;
  const isCancelDisabled = isCancelling || !canCancel;

  return (
    <View style={dynamicStyles.card}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.numberContainer}>
          <Text style={dynamicStyles.reservationNumber}>Réservation</Text>
          <Text style={dynamicStyles.reservationId}>
            ID: {reservation?.id}
          </Text>
        </View>
        <View style={dynamicStyles.statusBadge}>
          <Text style={dynamicStyles.statusText}>
            {getStatusText(reservation.status)}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={dynamicStyles.infoContainer}>
        <View style={dynamicStyles.infoRow}>
          <View style={dynamicStyles.infoIcon}>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              size={ms(14)}
              color={colors.secondary[500]}
            />
          </View>
          <Text style={dynamicStyles.infoText}>
            Récupération: {formatDate(reservation.pickupDate)}
          </Text>
        </View>
        <View style={dynamicStyles.infoRow}>
          <View style={dynamicStyles.infoIcon}>
            <FontAwesomeIcon
              icon={faClock}
              size={ms(14)}
              color={colors.secondary[500]}
            />
          </View>
          <Text style={dynamicStyles.infoText}>
            Créneau: {reservation.pickupTimeSlot}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={dynamicStyles.actionsContainer}>
        {/* View Products Button */}
        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.viewProductsButton]}
          onPress={onViewProducts}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon
            icon={faEye}
            size={ms(14)}
            color={colors.background}
            style={dynamicStyles.buttonIcon}
          />
          <Text style={dynamicStyles.buttonText}>Voir en détails</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        {canCancel && (
          <TouchableOpacity
            style={[
              dynamicStyles.actionButton,
              isCancelDisabled 
                ? dynamicStyles.cancelButtonDisabled 
                : dynamicStyles.cancelButton
            ]}
            onPress={onCancel}
            disabled={isCancelDisabled}
            activeOpacity={0.8}
          >
            {isCancelling ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <FontAwesomeIcon
                icon={faTimes}
                size={ms(14)}
                color={colors.background}
                style={dynamicStyles.buttonIcon}
              />
            )}
            <Text style={dynamicStyles.buttonText}>
              {isCancelling ? "Annulation..." : "Annuler"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReservationCardPresenter; 