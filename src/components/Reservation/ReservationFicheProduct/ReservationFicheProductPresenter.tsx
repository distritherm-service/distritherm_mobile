import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faBox,
  faExclamationTriangle,
  faRedo,
  faCrown,
  faTag,
  faCalendarCheck,
  faEye,
  faPercent,
  faCalendarAlt,
  faBoxOpen,
  faEuroSign,
  faHashtag,
  faLayerGroup,
  faClock,
  faUser,
  faPhone,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { EReservation, ReservationItem } from "src/types/Reservation";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CalculationsType {
  totalHT: number;
  totalTTC: number;
  totalTVA: number;
  totalQuantity: number;
  averagePrice: number;
}

interface ReservationFicheProductPresenterProps {
  visible: boolean;
  reservation: EReservation | null;
  reservationItems: ReservationItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  calculations: CalculationsType;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  formatPrice: (price: number) => string;
  onClose: () => void;
  onRefresh: () => void;
  onRetry: () => void;
}

const ReservationFicheProductPresenter: React.FC<ReservationFicheProductPresenterProps> = ({
  visible,
  reservation,
  reservationItems,
  loading,
  refreshing,
  error,
  calculations,
  slideAnim,
  fadeAnim,
  formatPrice,
  onClose,
  onRefresh,
  onRetry,
}) => {
  const colors = useColors();

  // Modern, elegant styles with premium design
  const styles = {
    // Modal structure
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalBackground,
      justifyContent: "flex-end" as const,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: ms(32),
      borderTopRightRadius: ms(32),
      height: screenHeight * 0.85,
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: -12 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 24,
      zIndex: 50,
    },

    // Header section with premium design
    header: {
      paddingHorizontal: ms(24),
      paddingTop: ms(16),
      paddingBottom: ms(20),
      borderBottomWidth: 1,
      borderBottomColor: colors.tertiary[200] + "20",
      backgroundColor: colors.background,
      borderTopLeftRadius: ms(32),
      borderTopRightRadius: ms(32),
    },
    dragIndicator: {
      width: ms(48),
      height: ms(5),
      backgroundColor: colors.tertiary[300],
      borderRadius: ms(4),
      alignSelf: "center" as const,
      marginBottom: ms(20),
      opacity: 0.6,
    },
    headerContent: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    headerLeft: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    headerIconContainer: {
      width: ms(56),
      height: ms(56),
      borderRadius: ms(20),
      backgroundColor: colors.secondary[500] + "12",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: ms(16),
      borderWidth: 1,
      borderColor: colors.secondary[500] + "20",
    },
    headerTitles: {
      flex: 1,
    },
    headerTitle: {
      fontSize: ms(24),
      fontWeight: "800" as const,
      color: colors.tertiary[900],
      marginBottom: ms(4),
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: ms(14),
      color: colors.tertiary[600],
      fontWeight: "500" as const,
      opacity: 0.8,
    },
    reservationInfo: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginTop: ms(4),
    },
    reservationInfoIcon: {
      marginRight: ms(6),
    },
    reservationInfoText: {
      fontSize: ms(12),
      color: colors.tertiary[500],
      fontWeight: "500" as const,
    },
    closeButton: {
      width: ms(44),
      height: ms(44),
      borderRadius: ms(22),
      backgroundColor: colors.tertiary[100],
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "60",
    },

    // Client info section
    clientInfoContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: ms(24),
      paddingVertical: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.tertiary[200] + "20",
      marginHorizontal: ms(20),
      marginBottom: ms(8),
      borderRadius: ms(16),
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    clientInfoTitle: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.tertiary[700],
      marginBottom: ms(12),
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    clientInfoTitleIcon: {
      marginRight: ms(8),
    },
    clientInfoRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: ms(8),
    },
    clientInfoIcon: {
      width: ms(20),
      alignItems: "center" as const,
    },
    clientInfoText: {
      fontSize: ms(14),
      color: colors.tertiary[600],
      marginLeft: ms(12),
      fontWeight: "500" as const,
    },

    // Section headers
    sectionHeaderContainer: {
      marginHorizontal: ms(20),
      marginTop: ms(8),
      marginBottom: ms(12),
    },
    sectionHeaderContent: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    sectionHeaderIcon: {
      marginRight: ms(8),
    },
    sectionHeaderTitle: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.tertiary[700],
    },

    // Content section
    content: {
      flex: 1,
      backgroundColor: colors.tertiary[50] + "30",
    },

    // Center container for loading/error states
    centerContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      padding: ms(40),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      marginTop: ms(16),
      textAlign: "center" as const,
    },

    // Error state
    errorContainer: {
      alignItems: "center" as const,
    },
    errorIcon: {
      marginBottom: ms(20),
    },
    errorTitle: {
      fontSize: ms(20),
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: ms(16),
      textAlign: "center" as const,
    },
    retryButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.secondary[500],
      paddingHorizontal: ms(20),
      paddingVertical: ms(12),
      borderRadius: ms(12),
    },
    retryButtonText: {
      color: colors.background,
      fontWeight: "600" as const,
      marginLeft: ms(8),
    },

    // Empty state
    emptyContainer: {
      alignItems: "center" as const,
    },
    emptyIcon: {
      marginBottom: ms(20),
    },
    emptyTitle: {
      fontSize: ms(20),
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: ms(12),
      textAlign: "center" as const,
    },
    emptyDescription: {
      fontSize: ms(16),
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: ms(24),
    },

    // Product list
    productsList: {
      flex: 1,
      paddingTop: ms(8),
    },

    // Modern product card design
    productCard: {
      marginHorizontal: ms(20),
      marginBottom: ms(16),
      borderRadius: ms(18),
      backgroundColor: colors.surface,
      overflow: "hidden" as const,
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "20",
    },
    cardContent: {
      padding: ms(18),
    },

    // Product header with image and info
    productHeader: {
      flexDirection: "row" as const,
      marginBottom: ms(16),
    },
    imageContainer: {
      width: ms(70),
      height: ms(70),
      borderRadius: ms(16),
      backgroundColor: colors.tertiary[100],
      marginRight: ms(12),
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    productImage: {
      width: ms(70),
      height: ms(70),
      borderRadius: ms(16),
    },
    imagePlaceholder: {
      width: ms(70),
      height: ms(70),
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.tertiary[100],
    },
    productInfo: {
      flex: 1,
      justifyContent: "space-between" as const,
    },
    productName: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: ms(8),
      lineHeight: ms(22),
    },
    productMeta: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: ms(6),
    },
    metaChip: {
      backgroundColor: colors.tertiary[100],
      borderRadius: ms(8),
      paddingHorizontal: ms(8),
      paddingVertical: ms(4),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "40",
    },
    brandChip: {
      backgroundColor: colors.secondary[50],
      borderColor: colors.secondary[200] + "40",
    },
    metaText: {
      fontSize: ms(10),
      fontWeight: "600" as const,
      color: colors.tertiary[600],
      marginLeft: ms(4),
    },
    brandText: {
      color: colors.secondary[600],
    },
    quantityChip: {
      backgroundColor: colors.secondary[50],
      borderRadius: ms(8),
      paddingHorizontal: ms(6),
      paddingVertical: ms(3),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: colors.secondary[200] + "40",
      alignSelf: "flex-start" as const,
    },
    quantityText: {
      fontSize: ms(9),
      fontWeight: "600" as const,
      color: colors.secondary[600],
      marginLeft: ms(3),
    },

    // Pricing section
    pricingSection: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      backgroundColor: colors.tertiary[50] + "60",
      borderRadius: ms(12),
      padding: ms(12),
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "30",
    },
    totalLabel: {
      fontSize: ms(14),
      fontWeight: "600" as const,
      color: colors.tertiary[600],
    },
    totalValue: {
      fontSize: ms(18),
      fontWeight: "800" as const,
      color: colors.secondary[600],
    },

    // Summary section
    summaryContainer: {
      margin: ms(20),
      marginTop: ms(10),
      backgroundColor: colors.surface,
      borderRadius: ms(20),
      padding: ms(20),
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.secondary[200] + "20",
    },
    summaryHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: ms(20),
    },
    summaryIcon: {
      width: ms(48),
      height: ms(48),
      borderRadius: ms(16),
      backgroundColor: colors.secondary[500] + "12",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: ms(12),
      borderWidth: 1,
      borderColor: colors.secondary[500] + "20",
    },
    summaryTitle: {
      fontSize: ms(20),
      fontWeight: "800" as const,
      color: colors.text,
    },
    summaryRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: ms(12),
    },
    summaryLabel: {
      fontSize: ms(15),
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: ms(15),
      fontWeight: "700" as const,
      color: colors.text,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: colors.border + "40",
      marginVertical: ms(16),
    },
    summaryTotal: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      backgroundColor: colors.secondary[50] + "60",
      borderRadius: ms(12),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.secondary[200] + "30",
    },
    summaryTotalLabel: {
      fontSize: ms(18),
      fontWeight: "800" as const,
      color: colors.tertiary[700],
    },
    summaryTotalValue: {
      fontSize: ms(20),
      fontWeight: "900" as const,
      color: colors.secondary[600],
    },
  };

  // Individual reservation item component
  const ReservationItemComponent: React.FC<{ item: ReservationItem; index: number }> = ({
    item,
    index,
  }) => {
    return (
      <View style={styles.productCard}>
        <View style={styles.cardContent}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <FontAwesomeIcon
                    icon={faBox}
                    size={ms(20)}
                    color={colors.tertiary[400]}
                  />
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.productName || "Produit sans nom"}
              </Text>

              <View style={styles.productMeta}>
                {item.categoryName && (
                  <View style={styles.metaChip}>
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      size={ms(8)}
                      color={colors.tertiary[600]}
                    />
                    <Text style={styles.metaText}>{item.categoryName}</Text>
                  </View>
                )}
                {item.markName && (
                  <View style={[styles.metaChip, styles.brandChip]}>
                    <FontAwesomeIcon
                      icon={faCrown}
                      size={ms(8)}
                      color={colors.secondary[500]}
                    />
                    <Text style={[styles.metaText, styles.brandText]}>
                      {item.markName}
                    </Text>
                  </View>
                )}
                
                {/* Quantity Chip */}
                <View style={styles.quantityChip}>
                  <FontAwesomeIcon
                    icon={faBox}
                    size={ms(8)}
                    color={colors.secondary[500]}
                  />
                  <Text style={styles.quantityText}>
                    {item.quantity} {item.quantity > 1 ? "unités" : "unité"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.pricingSection}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{formatPrice(item.totalHt)}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Client information section
  const renderClientInfo = () => (
    <View style={styles.clientInfoContainer}>
      <View style={styles.clientInfoTitle}>
        <FontAwesomeIcon
          icon={faUser}
          size={ms(14)}
          color={colors.tertiary[700]}
          style={styles.clientInfoTitleIcon}
        />
        <Text style={styles.clientInfoTitle}>Informations client</Text>
      </View>
      
      <View style={styles.clientInfoRow}>
        <View style={styles.clientInfoIcon}>
          <FontAwesomeIcon
            icon={faUser}
            size={ms(12)}
            color={colors.tertiary[500]}
          />
        </View>
        <Text style={styles.clientInfoText}>
          {reservation?.customerName || "Non renseigné"}
        </Text>
      </View>
      
      <View style={styles.clientInfoRow}>
        <View style={styles.clientInfoIcon}>
          <FontAwesomeIcon
            icon={faPhone}
            size={ms(12)}
            color={colors.tertiary[500]}
          />
        </View>
        <Text style={styles.clientInfoText}>
          {reservation?.customerPhone || "Non renseigné"}
        </Text>
      </View>

      {reservation?.customerEmail && (
        <View style={styles.clientInfoRow}>
          <View style={styles.clientInfoIcon}>
            <FontAwesomeIcon
              icon={faHashtag}
              size={ms(12)}
              color={colors.tertiary[500]}
            />
          </View>
          <Text style={styles.clientInfoText}>
            {reservation.customerEmail}
          </Text>
        </View>
      )}

      {reservation?.notes && (
        <View style={styles.clientInfoRow}>
          <View style={styles.clientInfoIcon}>
            <FontAwesomeIcon
              icon={faComment}
              size={ms(12)}
              color={colors.tertiary[500]}
            />
          </View>
          <Text style={styles.clientInfoText}>
            Note du client: {reservation.notes}
          </Text>
        </View>
      )}
    </View>
  );

  // Summary section
  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryIcon}>
          <FontAwesomeIcon
            icon={faEuroSign}
            size={ms(18)}
            color={colors.secondary[500]}
          />
        </View>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Sous-total HT</Text>
        <Text style={styles.summaryValue}>
          {formatPrice(calculations.totalHT)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>TVA</Text>
        <Text style={styles.summaryValue}>
          {formatPrice(calculations.totalTVA)}
        </Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalLabel}>Total TTC</Text>
        <Text style={styles.summaryTotalValue}>
          {formatPrice(calculations.totalTTC)}
        </Text>
      </View>
    </View>
  );

  // Main content rendering
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.secondary[500]} />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size={ms(48)}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorTitle}>Erreur de chargement</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <FontAwesomeIcon
                icon={faRedo}
                size={ms(14)}
                color={colors.background}
              />
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (reservationItems.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <FontAwesomeIcon
                icon={faBox}
                size={ms(64)}
                color={colors.tertiary[400]}
              />
            </View>
            <Text style={styles.emptyTitle}>Aucun produit</Text>
            <Text style={styles.emptyDescription}>
              Cette réservation ne contient aucun produit pour le moment.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.productsList}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.secondary[500]]}
            tintColor={colors.secondary[500]}
          />
        }
      >
        {/* Client Information Section */}
        {renderClientInfo()}

        {/* Products Section Header */}
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <FontAwesomeIcon
              icon={faBox}
              size={ms(16)}
              color={colors.tertiary[700]}
              style={styles.sectionHeaderIcon}
            />
            <Text style={styles.sectionHeaderTitle}>Produits de la réservation</Text>
          </View>
        </View>

        {/* Products List */}
        {reservationItems.map((item, index) => (
          <ReservationItemComponent key={`reservation-item-${item.id}`} item={item} index={index} />
        ))}

        {renderSummary()}
      </ScrollView>
    );
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor={colors.modalBackground}
        barStyle="light-content"
      />

      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragIndicator} />

            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconContainer}>
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    size={ms(20)}
                    color={colors.secondary[500]}
                  />
                </View>
                <View style={styles.headerTitles}>
                  <Text style={styles.headerTitle}>Réservation</Text>
                  <Text style={styles.headerSubtitle}>ID: {reservation?.id}</Text>
                  {reservation?.pickupDate && (
                    <View style={styles.reservationInfo}>
                      <FontAwesomeIcon
                        icon={faClock}
                        size={ms(10)}
                        color={colors.tertiary[500]}
                        style={styles.reservationInfoIcon}
                      />
                      <Text style={styles.reservationInfoText}>
                        {formatDate(reservation.pickupDate)} • {reservation.pickupTimeSlot}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={ms(16)}
                  color={colors.tertiary[600]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>{renderContent()}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ReservationFicheProductPresenter; 