import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { ms, s, vs } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faBox,
  faEuroSign,
  faShoppingCart,
  faExclamationTriangle,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { Devis } from "src/types/Devis";
import { CartItemWithProduct } from "src/types/Cart";
import LoadingState from "src/components/LoadingState/LoadingState";
import ErrorState from "src/components/ErrorState/ErrorState";

interface DevisProductsModalPresenterProps {
  visible: boolean;
  devis: Devis | null;
  products: CartItemWithProduct[];
  loading: boolean;
  error: string | null;
  totalHT: number;
  totalTTC: number;
  onClose: () => void;
  onRetry: () => void;
}

const DevisProductsModalPresenter: React.FC<DevisProductsModalPresenterProps> = ({
  visible,
  devis,
  products,
  loading,
  error,
  totalHT,
  totalTTC,
  onClose,
  onRetry,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end" as const,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: ms(25),
      borderTopRightRadius: ms(25),
      maxHeight: "90%" as const,
      minHeight: "60%" as const,
    },
    dragIndicator: {
      width: ms(40),
      height: vs(4),
      backgroundColor: colors.tertiary[300],
      borderRadius: ms(2),
      alignSelf: "center" as const,
      marginTop: vs(12),
      marginBottom: vs(8),
    },
    header: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingHorizontal: s(20),
      paddingVertical: vs(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "40",
    },
    headerTitle: {
      fontSize: ms(18),
      fontWeight: "700" as const,
      color: colors.text,
      flex: 1,
    },
    closeButton: {
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      backgroundColor: colors.tertiary[100],
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: vs(60),
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingHorizontal: s(40),
      paddingVertical: vs(40),
    },
    errorIcon: {
      marginBottom: vs(16),
    },
    errorTitle: {
      fontSize: ms(18),
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
      marginBottom: vs(8),
    },
    errorDescription: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: ms(20),
      marginBottom: vs(24),
    },
    retryButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: s(24),
      paddingVertical: vs(12),
      borderRadius: ms(12),
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: ms(14),
      fontWeight: "600" as const,
      marginLeft: s(8),
    },
    productsList: {
      flex: 1,
      paddingHorizontal: s(20),
      paddingTop: vs(16),
    },
    productItem: {
      flexDirection: "row" as const,
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      padding: s(16),
      marginBottom: vs(12),
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    productImage: {
      width: ms(60),
      height: ms(60),
      borderRadius: ms(12),
      backgroundColor: colors.tertiary[100],
      marginRight: s(16),
    },
    productImagePlaceholder: {
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: ms(16),
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: vs(4),
      lineHeight: ms(20),
    },
    productDetails: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: vs(8),
    },
    productQuantity: {
      fontSize: ms(14),
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    productPrices: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },
    priceContainer: {
      alignItems: "flex-end" as const,
    },
    priceLabel: {
      fontSize: ms(11),
      color: colors.textSecondary,
      fontWeight: "500" as const,
      textTransform: "uppercase" as const,
    },
    priceValue: {
      fontSize: ms(14),
      fontWeight: "700" as const,
      color: colors.text,
    },
    totalContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: s(20),
      paddingVertical: vs(20),
      borderTopWidth: 1,
      borderTopColor: colors.border + "40",
      marginTop: vs(8),
    },
    totalRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: vs(8),
    },
    totalLabel: {
      fontSize: ms(16),
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    totalValue: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.text,
    },
    totalFinalRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingTop: vs(12),
      borderTopWidth: 1,
      borderTopColor: colors.border + "60",
    },
    totalFinalLabel: {
      fontSize: ms(18),
      fontWeight: "700" as const,
      color: colors.text,
    },
    totalFinalValue: {
      fontSize: ms(18),
      fontWeight: "800" as const,
      color: colors.primary[500],
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: vs(60),
    },
    emptyIcon: {
      marginBottom: vs(20),
    },
    emptyTitle: {
      fontSize: ms(18),
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
      marginBottom: vs(8),
    },
    emptyDescription: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: ms(20),
      paddingHorizontal: s(40),
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const renderProductItem = ({ item }: { item: CartItemWithProduct }) => {
    const productImages = item.product?.imagesUrl || [];
    const imageUrl = Array.isArray(productImages) && productImages.length > 0 
      ? productImages[0] 
      : null;

    const totalPriceHT = item.priceHt * item.quantity;
    const totalPriceTTC = item.priceTtc * item.quantity;

    return (
      <View style={dynamicStyles.productItem}>
        <View style={dynamicStyles.productImage}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={dynamicStyles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[dynamicStyles.productImage, dynamicStyles.productImagePlaceholder]}>
              <FontAwesomeIcon
                icon={faBox}
                size={ms(24)}
                color={colors.tertiary[400]}
              />
            </View>
          )}
        </View>

        <View style={dynamicStyles.productInfo}>
          <Text style={dynamicStyles.productName} numberOfLines={2}>
            {item.product?.name || "Produit sans nom"}
          </Text>

          <View style={dynamicStyles.productDetails}>
            <FontAwesomeIcon
              icon={faShoppingCart}
              size={ms(12)}
              color={colors.textSecondary}
            />
            <Text style={[dynamicStyles.productQuantity, { marginLeft: s(6) }]}>
              Quantité: {item.quantity}
            </Text>
          </View>

          <View style={dynamicStyles.productPrices}>
            <View style={dynamicStyles.priceContainer}>
              <Text style={dynamicStyles.priceLabel}>Total HT</Text>
              <Text style={dynamicStyles.priceValue}>
                {formatPrice(totalPriceHT)}
              </Text>
            </View>
            <View style={dynamicStyles.priceContainer}>
              <Text style={dynamicStyles.priceLabel}>Total TTC</Text>
              <Text style={dynamicStyles.priceValue}>
                {formatPrice(totalPriceTTC)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[dynamicStyles.errorDescription, { marginTop: vs(16) }]}>
            Chargement des produits...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={dynamicStyles.errorContainer}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size={ms(48)}
            color={colors.error}
            style={dynamicStyles.errorIcon}
          />
          <Text style={dynamicStyles.errorTitle}>Erreur de chargement</Text>
          <Text style={dynamicStyles.errorDescription}>{error}</Text>
          <TouchableOpacity style={dynamicStyles.retryButton} onPress={onRetry}>
            <FontAwesomeIcon
              icon={faRedo}
              size={ms(14)}
              color={colors.background}
            />
            <Text style={dynamicStyles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={dynamicStyles.emptyContainer}>
          <FontAwesomeIcon
            icon={faBox}
            size={ms(64)}
            color={colors.tertiary[400]}
            style={dynamicStyles.emptyIcon}
          />
          <Text style={dynamicStyles.emptyTitle}>Aucun produit</Text>
          <Text style={dynamicStyles.emptyDescription}>
            Ce devis ne contient aucun produit.
          </Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          style={dynamicStyles.productsList}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={dynamicStyles.totalContainer}>
          <View style={dynamicStyles.totalRow}>
            <Text style={dynamicStyles.totalLabel}>Total HT</Text>
            <Text style={dynamicStyles.totalValue}>{formatPrice(totalHT)}</Text>
          </View>
          <View style={dynamicStyles.totalFinalRow}>
            <Text style={dynamicStyles.totalFinalLabel}>Total TTC</Text>
            <Text style={dynamicStyles.totalFinalValue}>{formatPrice(totalTTC)}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.modalOverlay}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.dragIndicator} />
          
          <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.headerTitle}>
              Produits du devis #{devis?.id}
            </Text>
            <TouchableOpacity
              style={dynamicStyles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size={ms(16)}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={dynamicStyles.content}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DevisProductsModalPresenter; 