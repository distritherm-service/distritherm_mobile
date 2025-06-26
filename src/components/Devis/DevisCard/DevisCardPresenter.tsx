import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faDownload,
  faCalendarAlt,
  faEye,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { Devis, DevisStatus } from "src/types/Devis";

interface DevisCardPresenterProps {
  devis: Devis;
  onDownload: () => void;
  onViewProducts: () => void;
  onDelete?: () => void;
  isDownloading: boolean;
  isDeleting: boolean;
  getStatusText: (status: DevisStatus) => string;
  getStatusColor: (status: DevisStatus) => string;
  formatDate: (date: Date) => string;
}

const DevisCardPresenter: React.FC<DevisCardPresenterProps> = ({
  devis,
  onDownload,
  onViewProducts,
  onDelete,
  isDownloading,
  isDeleting,
  getStatusText,
  getStatusColor,
  formatDate,
}) => {
  const colors = useColors();
  const statusColor = getStatusColor(devis.status);

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
    devisNumber: {
      fontSize: ms(20), // Larger for better hierarchy
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: ms(4),
    },
    devisId: {
      fontSize: ms(13),
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    statusBadge: {
      paddingHorizontal: ms(14),
      paddingVertical: ms(8),
      borderRadius: ms(25), // More rounded
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
      justifyContent: "space-between" as const,
      paddingTop: ms(16),
      borderTopWidth: 1,
      borderTopColor: colors.border + "40", // Semi-transparent
      flexWrap: "wrap" as const,
      gap: ms(10),
    },
    actionButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: ms(12),
      paddingVertical: ms(10),
      borderRadius: ms(12), // Slightly smaller for more buttons
      height: ms(45),
      flex: 1,
    },
    viewAndDeleteContainer: {
      flexDirection: "row" as const,
      gap: ms(7),
    },
    downloadButton: {
      backgroundColor: colors.secondary[500],
      shadowColor: colors.secondary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    downloadButtonDisabled: {
      backgroundColor: colors.tertiary[300],
      shadowOpacity: 0,
      elevation: 0,
    },
    viewProductsButton: {
      backgroundColor: colors.tertiary[500],
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    deleteButton: {
      backgroundColor: colors.danger[500],
      shadowColor: colors.danger[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    deleteButtonDisabled: {
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

  const isExpired = devis.status === DevisStatus.EXPIRED;
  const isDownloadDisabled = isDownloading || !devis.fileUrl;
  const canDelete = devis.status === DevisStatus.PROGRESS && onDelete;
  const isDeleteDisabled = isDeleting || !canDelete;

  return (
    <View style={dynamicStyles.card}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.numberContainer}>
          <Text style={dynamicStyles.devisNumber}>Devis</Text>
          <Text style={dynamicStyles.devisId}>
            ID: {devis?.id}
          </Text>
        </View>
        <View style={dynamicStyles.statusBadge}>
          <Text style={dynamicStyles.statusText}>
            {getStatusText(devis.status)}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={dynamicStyles.infoContainer}>
        <View style={dynamicStyles.infoRow}>
          <View style={dynamicStyles.infoIcon}>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              size={ms(14)}
              color={colors.textSecondary}
            />
          </View>
          <Text style={dynamicStyles.infoText}>
            Créé le {formatDate(devis.createdAt)}
          </Text>
        </View>

        <View style={dynamicStyles.infoRow}>
          <View style={dynamicStyles.infoIcon}>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              size={ms(14)}
              color={isExpired ? colors.error : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              dynamicStyles.infoText,
              isExpired && { color: colors.error, fontWeight: "600" },
            ]}
          >
            {isExpired ? "Expiré le" : "Expire le"} {formatDate(devis.endDate)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={dynamicStyles.actionsContainer}>
        {/* View and Delete */}
        <View style={dynamicStyles.viewAndDeleteContainer}>
          {/* View products */}
          <TouchableOpacity
            style={[
              dynamicStyles.actionButton,
              dynamicStyles.viewProductsButton,
            ]}
            onPress={onViewProducts}
            activeOpacity={0.8}
          >
            <FontAwesomeIcon
              icon={faEye}
              size={ms(14)}
              color={colors.background}
              style={dynamicStyles.buttonIcon}
            />
            <Text style={dynamicStyles.buttonText}>Voir produits</Text>
          </TouchableOpacity>

          {canDelete && (
            <TouchableOpacity
              style={[
                dynamicStyles.actionButton,
                dynamicStyles.deleteButton,
                isDeleteDisabled && dynamicStyles.deleteButtonDisabled,
              ]}
              onPress={onDelete}
              disabled={isDeleteDisabled}
              activeOpacity={isDeleteDisabled ? 1 : 0.8}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faTrash}
                    size={ms(14)}
                    color={colors.background}
                    style={dynamicStyles.buttonIcon}
                  />
                  <Text style={dynamicStyles.buttonText}>Supprimer</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {!isDownloadDisabled && (
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.downloadButton]}
            onPress={onDownload}
            activeOpacity={0.8}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faDownload}
                  size={ms(14)}
                  color={colors.background}
                  style={dynamicStyles.buttonIcon}
                />
                <Text style={dynamicStyles.buttonText}>Télécharger</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DevisCardPresenter;
