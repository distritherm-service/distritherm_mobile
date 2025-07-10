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
  faShoppingCart,
  faExclamationTriangle,
  faRedo,
  faCrown,
  faTag,
  faGem,
  faStar,
  faFileInvoiceDollar,
  faEye,
  faPercent,
  faCalendarAlt,
  faBoxOpen,
  faEuroSign,
  faHashtag,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { Devis } from "src/types/Devis";
import { CartItemWithProduct } from "src/types/Cart";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CalculationsType {
  totalHT: number;
  totalTTC: number;
  totalTVA: number;
  totalQuantity: number;
  averagePrice: number;
}

interface DevisFicheProductPresenterProps {
  visible: boolean;
  devis: Devis | null;
  cartItems: CartItemWithProduct[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  calculations: CalculationsType;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  formatPrice: (price: number) => string;
  user?: any;
  onClose: () => void;
  onRefresh: () => void;
  onRetry: () => void;
}

const DevisFicheProductPresenter: React.FC<DevisFicheProductPresenterProps> = ({
  visible,
  devis,
  cartItems,
  loading,
  refreshing,
  error,
  calculations,
  slideAnim,
  fadeAnim,
  formatPrice,
  user,
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

    // Content section
    content: {
      flex: 1,
      backgroundColor: colors.tertiary[50] + "30",
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
    promotionChip: {
      backgroundColor: colors.error,
      borderRadius: ms(8),
      paddingHorizontal: ms(6),
      paddingVertical: ms(3),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      alignSelf: "flex-start" as const,
    },
    promotionText: {
      fontSize: ms(9),
      fontWeight: "600" as const,
      color: colors.background,
      marginLeft: ms(3),
    },
    productInfo: {
      flex: 1,
      justifyContent: "space-between" as const,
    },
    productName: {
      fontSize: ms(15),
      fontWeight: "700" as const,
      color: colors.tertiary[900],
      lineHeight: ms(20),
      marginBottom: ms(6),
    },
    productMeta: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: ms(6),
      marginBottom: ms(10),
    },
    metaChip: {
      backgroundColor: colors.tertiary[100],
      borderRadius: ms(10),
      paddingHorizontal: ms(8),
      paddingVertical: ms(4),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "40",
    },
    metaText: {
      fontSize: ms(9),
      fontWeight: "600" as const,
      color: colors.tertiary[700],
      marginLeft: ms(3),
    },
    brandChip: {
      backgroundColor: colors.secondary[50],
      borderColor: colors.secondary[200] + "60",
    },
    brandText: {
      color: colors.secondary[600],
    },

    // Simplified pricing section
    pricingSection: {
      backgroundColor: colors.tertiary[50] + "60",
      borderRadius: ms(16),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "30",
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },
    totalLabel: {
      fontSize: ms(12),
      fontWeight: "600" as const,
      color: colors.tertiary[700],
    },
    totalValue: {
      fontSize: ms(18),
      fontWeight: "900" as const,
      color: colors.secondary[600],
      letterSpacing: -0.5,
    },

    // Discount pricing styles
    discountPricingContainer: {
      gap: ms(8),
      width: "100%" as const,
    },
    originalPriceContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: ms(4),
    },
    originalPriceLabel: {
      fontSize: ms(11),
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    originalPriceValue: {
      fontSize: ms(13),
      fontWeight: "600" as const,
      color: colors.textSecondary,
      textDecorationLine: "line-through" as const,
    },
    discountedPriceContainer: {
      gap: ms(4),
    },
    discountedPriceRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    discountBadgeInline: {
      paddingHorizontal: ms(8),
      paddingVertical: ms(4),
      borderRadius: ms(12),
      marginLeft: ms(8),
    },
    discountBadgeText: {
      fontSize: ms(10),
      fontWeight: "600" as const,
      color: colors.primary[50],
    },
    standardPricingContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      width: "100%" as const,
    },

    // Summary section redesign
    summaryContainer: {
      margin: ms(24),
      marginTop: ms(8),
      backgroundColor: colors.surface,
      borderRadius: ms(24),
      padding: ms(24),
      borderWidth: 1,
      borderColor: colors.tertiary[200] + "30",
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
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
      backgroundColor: colors.secondary[500] + "15",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: ms(12),
    },
    summaryTitle: {
      fontSize: ms(18),
      fontWeight: "700" as const,
      color: colors.tertiary[900],
      letterSpacing: -0.3,
    },
    summaryRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: ms(12),
      paddingVertical: ms(4),
    },
    summaryLabel: {
      fontSize: ms(14),
      fontWeight: "500" as const,
      color: colors.tertiary[600],
    },
    summaryValue: {
      fontSize: ms(14),
      fontWeight: "600" as const,
      color: colors.tertiary[800],
    },
    summaryDivider: {
      height: 1,
      backgroundColor: colors.tertiary[300] + "50",
      marginVertical: ms(16),
    },
    summaryTotal: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      backgroundColor: colors.secondary[50],
      borderRadius: ms(16),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.secondary[200] + "40",
    },
    summaryTotalLabel: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.tertiary[900],
    },
    summaryTotalValue: {
      fontSize: ms(24),
      fontWeight: "900" as const,
      color: colors.secondary[600],
      letterSpacing: -0.7,
    },

    // Loading, error, empty states
    centerContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: ms(80),
      paddingHorizontal: ms(40),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.tertiary[600],
      marginTop: ms(16),
      fontWeight: "500" as const,
      textAlign: "center" as const,
    },
    errorContainer: {
      alignItems: "center" as const,
    },
    errorIcon: {
      marginBottom: ms(16),
    },
    errorTitle: {
      fontSize: ms(20),
      fontWeight: "700" as const,
      color: colors.tertiary[900],
      textAlign: "center" as const,
      marginBottom: ms(8),
    },
    errorDescription: {
      fontSize: ms(15),
      color: colors.tertiary[600],
      textAlign: "center" as const,
      marginBottom: ms(24),
      lineHeight: ms(22),
    },
    retryButton: {
      backgroundColor: colors.secondary[500],
      marginTop: ms(10),
      paddingHorizontal: ms(24),
      paddingVertical: ms(12),
      borderRadius: ms(24),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      shadowColor: colors.secondary[700],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: ms(14),
      fontWeight: "600" as const,
      marginLeft: ms(8),
    },
    emptyContainer: {
      alignItems: "center" as const,
    },
    emptyIcon: {
      marginBottom: ms(20),
      opacity: 0.6,
    },
    emptyTitle: {
      fontSize: ms(20),
      fontWeight: "700" as const,
      color: colors.tertiary[900],
      textAlign: "center" as const,
      marginBottom: ms(8),
    },
    emptyDescription: {
      fontSize: ms(15),
      color: colors.tertiary[600],
      textAlign: "center" as const,
      lineHeight: ms(22),
    },
  };

    // Individual cart item component with elegant design
  const CartItem: React.FC<{ item: CartItemWithProduct; index: number }> = ({
    item,
    index,
  }) => {
    const product = item.product;
    const imageUrl =
      Array.isArray(product?.imagesUrl) && product.imagesUrl.length > 0
        ? product.imagesUrl[0]
        : null;
    
    // Use HT price from cartItem directly
    const totalHT = item.priceHt;

    // Logique pour déterminer le type de remise appliquée
    const getDiscountInfo = () => {
      const hasProInfo = product?.proInfo?.isPro && 
                         product?.proInfo?.percentage && 
                         product?.proInfo?.proPriceHt;

      const hasPromotion = product?.isInPromotion && 
                          product?.promotionPrice && 
                          product?.promotionPercentage;

      // Si utilisateur pro et que le produit est dans sa catégorie, c'était une remise pro
      if (hasProInfo && user?.proInfo?.isPro && 
          user.proInfo.categoryIdPro === product?.proInfo?.categoryIdPro) {
        const originalTotal = (product?.priceHt || 0) * item.quantity;
        const discountedTotal = (product?.proInfo?.proPriceHt || 0) * item.quantity;
        return {
          type: 'pro' as const,
          percentage: product?.proInfo?.percentage!,
          originalTotal,
          isApplicable: Math.abs(originalTotal - discountedTotal) > 0.01
        };
      }

      // Sinon, vérifier si c'était une promotion normale
      if (hasPromotion) {
        const originalTotal = (product?.priceHt || 0) * item.quantity;
        const discountedTotal = (product?.promotionPrice! / 1.20) * item.quantity;
        return {
          type: 'promotion' as const,
          percentage: product?.promotionPercentage!,
          originalTotal,
          isApplicable: Math.abs(originalTotal - discountedTotal) > 0.01
        };
      }

      return {
        type: null,
        percentage: 0,
        originalTotal: totalHT,
        isApplicable: false
      };
    };

    const discountInfo = getDiscountInfo();

    return (
      <View style={styles.productCard}>
        <View style={styles.cardContent}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
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
                {product?.name || "Produit sans nom"}
              </Text>

              <View style={styles.productMeta}>
                {product?.category?.name && (
                  <View style={styles.metaChip}>
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      size={ms(8)}
                      color={colors.tertiary[600]}
                    />
                    <Text style={styles.metaText}>{product.category.name}</Text>
                  </View>
                )}
                {product?.mark?.name && (
                  <View style={[styles.metaChip, styles.brandChip]}>
                    <FontAwesomeIcon
                      icon={faCrown}
                      size={ms(8)}
                      color={colors.secondary[500]}
                    />
                    <Text style={[styles.metaText, styles.brandText]}>
                      {product.mark.name}
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

          {/* Enhanced Pricing Section with Discount Info */}
          <View style={styles.pricingSection}>
            {discountInfo.isApplicable ? (
              <View style={styles.discountPricingContainer}>
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPriceLabel}>Prix original HT</Text>
                  <Text style={styles.originalPriceValue}>
                    {formatPrice(discountInfo.originalTotal)}
                  </Text>
                </View>
                <View style={styles.discountedPriceContainer}>
                  <Text style={styles.totalLabel}>Total HT avec remise</Text>
                  <View style={styles.discountedPriceRow}>
                    <Text style={[
                      styles.totalValue,
                      { color: discountInfo.type === 'pro' ? colors.success[500] : colors.accent[500] }
                    ]}>
                      {formatPrice(totalHT)}
                    </Text>
                    <View style={[
                      styles.discountBadgeInline,
                      { backgroundColor: discountInfo.type === 'pro' ? colors.success[500] : colors.accent[500] }
                    ]}>
                      <Text style={styles.discountBadgeText}>
                        {discountInfo.type === 'pro' ? '👨‍💼' : '🔥'} -{discountInfo.percentage}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.standardPricingContainer}>
                <Text style={styles.totalLabel}>Total HT</Text>
                <Text style={styles.totalValue}>{formatPrice(totalHT)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

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

    if (cartItems.length === 0) {
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
              Ce devis ne contient aucun produit pour le moment.
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
        {cartItems.map((item, index) => (
          <CartItem key={`cart-item-${item.id}`} item={item} index={index} />
        ))}

        {renderSummary()}
      </ScrollView>
    );
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
                    icon={faFileInvoiceDollar}
                    size={ms(20)}
                    color={colors.secondary[500]}
                  />
                </View>
                <View style={styles.headerTitles}>
                  <Text style={styles.headerTitle}>Devis</Text>
                  <Text style={styles.headerSubtitle}>ID: {devis?.id}</Text>
                  <Text style={styles.headerSubtitle}>Détail des produits</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={ms(18)}
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

export default DevisFicheProductPresenter;
