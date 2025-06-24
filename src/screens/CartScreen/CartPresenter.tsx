import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faMinus,
  faTrash,
  faShoppingBag,
  faExclamationTriangle,
  faRefresh,
  faCheckCircle,
  faHeart,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import SectionHeader from "src/components/SectionHeader/SectionHeader";
import ErrorState from "src/components/ErrorState/ErrorState";
import UnauthenticatedState from "src/components/UnauthenticatedState/UnauthenticatedState";
import EmptyState from "src/components/EmptyState/EmptyState";
import { useColors } from "src/hooks/useColors";
import { Cart } from "src/types/Cart";
import { ProductBasicDto } from "src/types/Product";
import { CartItem } from "src/types/Cart";

// Extended cart interface for presenter
interface CartWithDetails extends Cart {
  cartItems: (CartItem & { product: ProductBasicDto })[];
}

interface CartTotals {
  subTotal: number;
  finalTotal: number;
  itemCount: number;
}

interface CartPresenterProps {
  cart: CartWithDetails | null;
  loading: boolean;
  error: string | null;
  loadingItems: Set<number>;
  isCreatingDevis: boolean;
  totals: CartTotals;
  isAuthenticated: boolean;
  onQuantityUpdate: (cartItemId: number, newQuantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
  onCreateDevis: () => void;
  onProductPress: (productId: number) => void;
  onBack: () => void;
  onRetry: () => void;
  onNavigateToLogin: () => void;
}

const CartPresenter: React.FC<CartPresenterProps> = ({
  cart,
  loading,
  error,
  loadingItems,
  isCreatingDevis,
  totals,
  isAuthenticated,
  onQuantityUpdate,
  onRemoveItem,
  onCreateDevis,
  onProductPress,
  onBack,
  onRetry,
  onNavigateToLogin,
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Content area with improved spacing
    contentContainer: {
      flex: 1,
      paddingTop: ms(16), // Smaller than before (was 24)
    },
    // Modern cart item design
    cartItem: {
      backgroundColor: colors.surface,
      marginHorizontal: ms(20),
      marginBottom: ms(16),
      borderRadius: ms(20),
      padding: ms(20),
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(4) },
      shadowOpacity: 0.08,
      shadowRadius: ms(12),
      elevation: 4,
      borderWidth: ms(1),
      borderColor: colors.tertiary[100],
    },
    cartItemContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    productImageContainer: {
      position: "relative",
      marginRight: ms(16),
    },
    productImage: {
      width: ms(80),
      height: ms(80),
      borderRadius: ms(16),
      backgroundColor: colors.tertiary[50],
    },
    favoriteButton: {
      position: "absolute",
      top: ms(-8),
      right: ms(-8),
      backgroundColor: colors.primary[50],
      width: ms(28),
      height: ms(28),
      borderRadius: ms(14),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.15,
      shadowRadius: ms(4),
      elevation: 3,
    },
    productInfo: {
      flex: 1,
      paddingRight: ms(12),
    },
    productName: {
      fontSize: ms(16),
      fontWeight: "700",
      color: colors.tertiary[500],
      marginBottom: ms(6),
      lineHeight: ms(22),
    },
    productDescription: {
      fontSize: ms(13),
      color: colors.textSecondary,
      marginBottom: ms(12),
      lineHeight: ms(18),
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: ms(16),
    },
    currentPrice: {
      fontSize: ms(18),
      fontWeight: "800",
      color: colors.secondary[500],
      marginRight: ms(8),
    },
    originalPrice: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textDecorationLine: "line-through",
      fontWeight: "500",
    },
    discountBadge: {
      backgroundColor: colors.success[500],
      paddingHorizontal: ms(8),
      paddingVertical: ms(4),
      borderRadius: ms(12),
      marginLeft: ms(8),
    },
    discountText: {
      color: colors.primary[50],
      fontSize: ms(11),
      fontWeight: "600",
    },
    // Enhanced quantity controls
    quantitySection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.tertiary[50],
      borderRadius: ms(16),
      padding: ms(8),
    },
    quantityControls: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary[50],
      borderRadius: ms(12),
      padding: ms(4),
    },
    quantityButton: {
      width: ms(36),
      height: ms(36),
      borderRadius: ms(18),
      backgroundColor: colors.tertiary[500],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.2,
      shadowRadius: ms(4),
      elevation: 3,
    },
    quantityButtonDisabled: {
      backgroundColor: colors.tertiary[200],
      shadowOpacity: 0,
      elevation: 0,
    },
    quantityText: {
      fontSize: ms(16),
      fontWeight: "700",
      color: colors.tertiary[500],
      minWidth: ms(40),
      textAlign: "center",
      marginHorizontal: ms(8),
    },
    removeButton: {
      backgroundColor: colors.danger[50],
      width: ms(36),
      height: ms(36),
      borderRadius: ms(18),
      justifyContent: "center",
      alignItems: "center",
      marginLeft: ms(12),
    },
    removeButtonDisabled: {
      backgroundColor: colors.tertiary[200],
      opacity: 0.6,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `${colors.primary[50]}95`,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ms(20),
    },

    // Modern summary section
    summarySection: {
      backgroundColor: colors.surface,
      marginHorizontal: ms(20),
      marginBottom: ms(20),
      borderRadius: ms(20),
      padding: ms(24),
      borderWidth: ms(1),
      borderColor: colors.tertiary[100],
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(6) },
      shadowOpacity: 0.1,
      shadowRadius: ms(16),
      elevation: 6,
    },
    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: ms(20),
    },
    summaryHeaderIcon: {
      backgroundColor: colors.secondary[100],
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      justifyContent: "center",
      alignItems: "center",
      marginRight: ms(12),
    },
    summaryHeaderText: {
      fontSize: ms(18),
      fontWeight: "700",
      color: colors.tertiary[500],
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: ms(8),
    },
    summaryLabel: {
      fontSize: ms(15),
      color: colors.textSecondary,
      fontWeight: "500",
    },
    summaryValue: {
      fontSize: ms(15),
      color: colors.tertiary[500],
      fontWeight: "600",
    },
    summaryDivider: {
      height: ms(1),
      backgroundColor: colors.tertiary[200],
      marginVertical: ms(16),
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.tertiary[50],
      borderRadius: ms(16),
      paddingHorizontal: ms(20),
      paddingVertical: ms(16),
      marginTop: ms(8),
    },
    totalLabel: {
      fontSize: ms(20),
      fontWeight: "800",
      color: colors.tertiary[500],
    },
    totalValue: {
      fontSize: ms(24),
      fontWeight: "900",
      color: colors.secondary[500],
    },
    // Stunning checkout section
    checkoutSection: {
      backgroundColor: colors.surface,
      marginHorizontal: ms(20),
      marginBottom: ms(32),
      borderRadius: ms(24),
      padding: ms(24),
      borderWidth: ms(1),
      borderColor: colors.tertiary[100],
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(8) },
      shadowOpacity: 0.15,
      shadowRadius: ms(20),
      elevation: 10,
    },
    checkoutButton: {
      backgroundColor: colors.tertiary[500],
      borderRadius: ms(20),
      paddingVertical: ms(18),
      paddingHorizontal: ms(28),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: ms(12),
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(6) },
      shadowOpacity: 0.4,
      shadowRadius: ms(12),
      elevation: 8,
    },
    checkoutButtonDisabled: {
      backgroundColor: colors.tertiary[200],
      shadowOpacity: 0,
      elevation: 0,
    },
    checkoutButtonText: {
      fontSize: ms(18),
      fontWeight: "800",
      color: colors.primary[50],
      letterSpacing: ms(0.5),
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(32),
    },
    loadingText: {
      fontSize: ms(18),
      color: colors.textSecondary,
      marginTop: ms(20),
      fontWeight: "600",
    },
  });

  // Enhanced cart item renderer
  const renderCartItem = ({ item }: { item: CartItem & { product: ProductBasicDto } }) => {
    const isItemLoading = loadingItems.has(item.id);
    
    // Handle price calculation with fallbacks
    let currentPrice = item.priceTtc;
    let originalPrice = null;
    let discountPercentage = 0;
    
    if (item.product) {
      if (item.product.isInPromotion && item.product.promotionPrice) {
        currentPrice = item.product.promotionPrice;
        originalPrice = item.product.priceTtc || item.priceTtc;
        discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
      } else if (item.product.priceTtc) {
        currentPrice = item.product.priceTtc;
      }
    }

    return (
      <View style={dynamicStyles.cartItem}>
        <View style={dynamicStyles.cartItemContent}>
          <View style={dynamicStyles.productImageContainer}>
            <Pressable onPress={() => item.product?.id && onProductPress(item.product.id)}>
              <Image
                source={{
                  uri: item.product?.imagesUrl?.[0]
                }}
                style={dynamicStyles.productImage}
                resizeMode="cover"
              />
            </Pressable>
            <Pressable style={dynamicStyles.favoriteButton}>
              <FontAwesomeIcon 
                icon={faHeart} 
                size={ms(12)} 
                color={colors.danger[400]} 
              />
            </Pressable>
          </View>
          
          <View style={dynamicStyles.productInfo}>
            <Pressable onPress={() => item.product?.id && onProductPress(item.product.id)}>
              <Text style={dynamicStyles.productName} numberOfLines={2}>
                {item.product?.name || `Produit #${item.productId}`}
              </Text>
            </Pressable>
            
            <Text style={dynamicStyles.productDescription} numberOfLines={2}>
              {item.product?.description || "Description non disponible"}
            </Text>
            
            <View style={dynamicStyles.priceRow}>
              <Text style={dynamicStyles.currentPrice}>
                ${currentPrice.toFixed(2)}
              </Text>
              {originalPrice && originalPrice !== currentPrice && (
                <>
                  <Text style={dynamicStyles.originalPrice}>
                    ${originalPrice.toFixed(2)}
                  </Text>
                  {discountPercentage > 0 && (
                    <View style={dynamicStyles.discountBadge}>
                      <Text style={dynamicStyles.discountText}>
                        -{discountPercentage}%
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        <View style={dynamicStyles.quantitySection}>
          <View style={dynamicStyles.quantityControls}>
            <Pressable
              style={[
                dynamicStyles.quantityButton,
                (item.quantity <= 1 || isItemLoading) && dynamicStyles.quantityButtonDisabled
              ]}
              onPress={() => !isItemLoading && onQuantityUpdate(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isItemLoading}
            >
              <FontAwesomeIcon 
                icon={faMinus} 
                size={ms(14)} 
                color={colors.primary[50]} 
              />
            </Pressable>
            
            <Text style={dynamicStyles.quantityText}>{item.quantity}</Text>
            
            <Pressable
              style={[
                dynamicStyles.quantityButton,
                isItemLoading && dynamicStyles.quantityButtonDisabled
              ]}
              onPress={() => !isItemLoading && onQuantityUpdate(item.id, item.quantity + 1)}
              disabled={isItemLoading}
            >
              <FontAwesomeIcon 
                icon={faPlus} 
                size={ms(14)} 
                color={colors.primary[50]} 
              />
            </Pressable>
          </View>

                    <Pressable
            style={[
              dynamicStyles.removeButton,
              isItemLoading && dynamicStyles.removeButtonDisabled
            ]}
            onPress={() => {
              if (isItemLoading) return;
              Alert.alert(
                "Supprimer l'article",
                "Êtes-vous sûr de vouloir supprimer cet article de votre panier ?",
                [
                  { text: "Annuler", style: "cancel" },
                  { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: () => onRemoveItem(item.id)
                  }
                ]
              );
            }}
            disabled={isItemLoading}
          >
            <FontAwesomeIcon 
              icon={faTrash} 
              size={ms(16)} 
              color={colors.danger[500]} 
            />
          </Pressable>
                </View>

        {isItemLoading && (
          <View style={dynamicStyles.loadingOverlay}>
            <ActivityIndicator color={colors.tertiary[500]} size="small" />
          </View>
        )}
      </View>
    );
  };

  // Elegant header component using shared SectionHeader
  const renderHeader = () => (
    <SectionHeader
      icon={faShoppingBag}
      title="Mon Panier"
      subtitle={
        isAuthenticated && cart && cart.cartItems && cart.cartItems.length > 0
          ? `${totals.itemCount} article${totals.itemCount > 1 ? 's' : ''}`
          : undefined
      }
      badgeCount={isAuthenticated && cart && cart.cartItems ? totals.itemCount : undefined}
      badgeColor="secondary"
      showBadge={!!(isAuthenticated && cart && cart.cartItems && cart.cartItems.length > 0)}
    />
  );

  // Loading state
  if (loading) {
    return (
      <PageContainer headerBack={false} bottomBar={true} style={dynamicStyles.container}>
        {renderHeader()}
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tertiary[500]} />
          <Text style={dynamicStyles.loadingText}>Chargement de votre panier...</Text>
        </View>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer headerBack={false} bottomBar={true} style={dynamicStyles.container}>
        {renderHeader()}
        <ErrorState
          description={error}
          onRetry={onRetry}
        />
      </PageContainer>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <PageContainer headerBack={false} bottomBar={true} style={dynamicStyles.container}>
        {renderHeader()}
        <UnauthenticatedState
          icon={faShoppingBag}
          title="Connectez-vous pour voir votre panier"
          description="Découvrez nos produits et gérez votre panier en vous connectant à votre compte."
          onNavigateToLogin={onNavigateToLogin}
          iconColor="secondary"
        />
      </PageContainer>
    );
  }

  // Empty cart state
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <PageContainer headerBack={false} bottomBar={true} style={dynamicStyles.container}>
        {renderHeader()}
        <EmptyState
          icon={faShoppingBag}
          title="Votre panier est vide"
          description="Découvrez nos produits et commencez vos achats dès maintenant !"
          iconColor="tertiary"
          variant="minimal"
        />
      </PageContainer>
    );
  }

  // Main cart content
  return (
    <PageContainer 
      headerBack={false} 
      bottomBar={true}
      isScrollable={false}
      style={dynamicStyles.container}
    >
      {renderHeader()}
      <ScrollView 
        style={dynamicStyles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: ms(32) }}
      >
        {/* Cart Items */}
        <FlatList
          data={cart.cartItems || []}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />



        {/* Summary Section */}
        <View style={dynamicStyles.summarySection}>
          <View style={dynamicStyles.summaryHeader}>
            <View style={dynamicStyles.summaryHeaderIcon}>
              <FontAwesomeIcon icon={faCheckCircle} size={ms(20)} color={colors.secondary[500]} />
            </View>
            <Text style={dynamicStyles.summaryHeaderText}>Résumé</Text>
          </View>
          
          <View style={dynamicStyles.summaryRow}>
            <Text style={dynamicStyles.summaryLabel}>Sous-total HT</Text>
            <Text style={dynamicStyles.summaryValue}>${(totals.subTotal / 1.2).toFixed(2)}</Text>
          </View>
          
          <View style={dynamicStyles.summaryRow}>
            <Text style={dynamicStyles.summaryLabel}>TVA (20%)</Text>
            <Text style={dynamicStyles.summaryValue}>
              ${(totals.subTotal - (totals.subTotal / 1.2)).toFixed(2)}
            </Text>
          </View>
          
          <View style={dynamicStyles.summaryDivider} />
          
          <View style={dynamicStyles.totalRow}>
            <Text style={dynamicStyles.totalLabel}>Total TTC</Text>
            <Text style={dynamicStyles.totalValue}>${totals.finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Section */}
        <View style={dynamicStyles.checkoutSection}>
          <Pressable 
            style={[
              dynamicStyles.checkoutButton,
              ((!cart.cartItems || cart.cartItems.length === 0) || isCreatingDevis) && dynamicStyles.checkoutButtonDisabled
            ]}
            onPress={onCreateDevis}
            disabled={(!cart.cartItems || cart.cartItems.length === 0) || isCreatingDevis}
          >
            {isCreatingDevis ? (
              <ActivityIndicator size="small" color={colors.primary[50]} />
            ) : (
              <>
                <FontAwesomeIcon icon={faArrowRight} size={ms(18)} color={colors.primary[50]} />
                <Text style={dynamicStyles.checkoutButtonText}>
                  Demander un devis
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default CartPresenter; 