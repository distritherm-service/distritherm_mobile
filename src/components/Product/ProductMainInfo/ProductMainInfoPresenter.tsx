import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ms } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { ProductDetailDto } from 'src/types/Product';
import { useColors } from 'src/hooks/useColors';
import { FontAwesome6 } from '@expo/vector-icons';

interface ProductMainInfoPresenterProps {
  product: ProductDetailDto;
  quantity: number;
  isLoading: boolean;
  hasStock: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  totalPrice: number;
  onQuantityChange: (quantity: number) => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

const ProductMainInfoPresenter: React.FC<ProductMainInfoPresenterProps> = ({
  product,
  quantity,
  isLoading,
  hasStock,
  isOutOfStock,
  isLowStock,
  totalPrice,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.tertiary[800],
    },
    titleSectionBorder: {
      borderBottomColor: colors.border,
    },
    priceSectionBorder: {
      borderBottomColor: colors.border,
    },
    quantityContainer: {
      shadowColor: colors.tertiary[800],
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getStockBadge = () => {
    if (isOutOfStock) {
      return (
        <View style={[styles.stockBadge, styles.stockBadgeError, { backgroundColor: colors.danger[500] + '15', borderColor: colors.danger[500] }]}>
          <View style={[styles.stockIndicator, { backgroundColor: colors.danger[500] }]} />
          <Text style={[styles.stockBadgeText, { color: colors.danger[600] }]}>
            Rupture de stock
          </Text>
        </View>
      );
    }
    
    if (isLowStock) {
      return (
        <View style={[styles.stockBadge, styles.stockBadgeWarning, { backgroundColor: colors.warning[500] + '15', borderColor: colors.warning[500] }]}>
          <View style={[styles.stockIndicator, { backgroundColor: colors.warning[500] }]} />
          <Text style={[styles.stockBadgeText, { color: colors.warning[600] }]}>
            Stock limité ({product.quantity} restant{product.quantity > 1 ? 's' : ''})
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.stockBadge, { backgroundColor: colors.success[500] + '15', borderColor: colors.success[500] }]}>
        <View style={[styles.stockIndicator, { backgroundColor: colors.success[500] }]} />
        <Text style={[styles.stockBadgeText, { color: colors.success[600] }]}>
          En stock ({product.quantity} disponible{product.quantity > 1 ? 's' : ''})
        </Text>
      </View>
    );
  };

  const getPromotionBadge = () => {
    if (product.isInPromotion && product.promotionPercentage) {
      return (
        <View style={[styles.promotionBadge, { backgroundColor: colors.accent[500] }]}>
          <Text style={[styles.promotionIcon, { color: colors.primary[50] }]}>🔥</Text>
          <Text style={[styles.promotionBadgeText, { color: colors.primary[50] }]}>
            -{product.promotionPercentage}%
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Enhanced Product Title Section */}
      <View style={[styles.titleSection, dynamicStyles.titleSectionBorder]}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {product.name}
        </Text>
        
        {/* Enhanced Category and Brand */}
        <View style={styles.metaInfo}>
          {product.category && (
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.tertiary[600] }]}>
                Catégorie
              </Text>
              <View style={[styles.categoryChip, { backgroundColor: colors.secondary[50], borderColor: colors.secondary[200] }]}>
                <Text style={[styles.categoryText, { color: colors.secondary[600] }]}>
                  {product.category.name}
                </Text>
              </View>
            </View>
          )}
          {product.mark && (
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.tertiary[600] }]}>
                Marque
              </Text>
              <View style={[styles.brandChip, { backgroundColor: colors.primary[50], borderColor: colors.primary[200] }]}>
                <Text style={[styles.brandText, { color: colors.primary[600] }]}>
                  {product.mark.name}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Enhanced Price Section */}
      <View style={[styles.priceSection, dynamicStyles.priceSectionBorder]}>
        <View style={styles.priceContainer}>
          {product.isInPromotion && product.promotionPrice ? (
            <View style={styles.promotionPriceContainer}>
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                {formatPrice(product.priceHt)}
              </Text>
              <View style={styles.currentPriceContainer}>
                <Text style={[styles.currentPrice, { color: colors.accent[500] }]}>
                  {formatPrice(product.promotionPrice / 1.20)}
                </Text>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>HT</Text>
              </View>
            </View>
          ) : (
            <View style={styles.currentPriceContainer}>
              <Text style={[styles.currentPrice, { color: colors.text }]}>
                {formatPrice(product.priceHt)}
              </Text>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>HT</Text>
            </View>
          )}
        </View>
        {getPromotionBadge()}
      </View>

      {/* Enhanced Stock Status */}
      <View style={styles.stockSection}>
        {getStockBadge()}
      </View>

      {/* Enhanced Quantity Section */}
      {hasStock && (
        <View style={styles.quantitySection}>
          <Text style={[styles.quantityLabel, { color: colors.text }]}>
            Quantité
          </Text>
          <View style={[styles.quantityContainer, { backgroundColor: colors.background, borderColor: colors.border }, dynamicStyles.quantityContainer]}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: quantity <= 1 ? colors.primary[100] : colors.secondary[50] },
                quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={onDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: quantity <= 1 ? colors.textSecondary : colors.secondary[500] }
                ]}
              >
                -
              </Text>
            </TouchableOpacity>
            
            <View style={styles.quantityTextContainer}>
              <Text style={[styles.quantityText, { color: colors.text }]}>
                {quantity}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: quantity >= product.quantity ? colors.primary[100] : colors.secondary[50] },
                quantity >= product.quantity && styles.quantityButtonDisabled,
              ]}
              onPress={onIncreaseQuantity}
              disabled={quantity >= product.quantity}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: quantity >= product.quantity ? colors.textSecondary : colors.secondary[500] }
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Enhanced Total Price */}
      {hasStock && quantity > 1 && (
        <View style={[styles.totalSection, { borderTopColor: colors.border }]}>
          <View style={styles.totalContent}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total ({quantity} unité{quantity > 1 ? 's' : ''}):
            </Text>
            <Text style={[styles.totalPrice, { color: colors.secondary[500] }]}>
              {formatPrice(totalPrice)}
            </Text>
          </View>
        </View>
      )}

      {/* Enhanced Add to Cart Button */}
      <TouchableOpacity
        style={[
          styles.addToCartButton,
          {
            backgroundColor: isOutOfStock
              ? colors.textSecondary
              : colors.secondary[500],
          },
          !isOutOfStock && styles.addToCartButtonActive,
        ]}
        onPress={onAddToCart}
        disabled={isOutOfStock || isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary[50]} size="small" />
            <Text style={[styles.loadingText, { color: colors.primary[50] }]}>
              Ajout en cours...
            </Text>
          </View>
        ) : (
          <View style={styles.addToCartContent}>
            <FontAwesome6
              name={isOutOfStock ? 'triangle-exclamation' : 'cart-shopping'}
              size={ms(16)}
              color={colors.primary[50]}
              style={styles.cartIcon}
            />
            <Text style={[styles.addToCartText, { color: colors.primary[50] }]}>
              {isOutOfStock ? 'Produit indisponible' : 'Ajouter au panier'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    paddingVertical: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    borderRadius: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    marginHorizontal: ms(16), // Using react-native-size-matters for responsive design
    marginVertical: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)', // Subtle tertiary border
  },
  titleSection: {
    marginBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    paddingBottom: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: ms(22), // Using react-native-size-matters for responsive design - reduced from 26
    fontWeight: '800',
    lineHeight: ms(28), // Using react-native-size-matters for responsive design - reduced from 32
    marginBottom: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
    letterSpacing: -0.5,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8), // Using react-native-size-matters for responsive design
  },
  metaLabel: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - keeping unchanged as requested
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryChip: {
    paddingHorizontal: ms(12), // Using react-native-size-matters for responsive design
    paddingVertical: ms(6), // Using react-native-size-matters for responsive design
    borderRadius: ms(16), // Using react-native-size-matters for responsive design
    borderWidth: 1,
  },
  categoryText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - keeping unchanged as requested
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  brandChip: {
    paddingHorizontal: ms(12), // Using react-native-size-matters for responsive design
    paddingVertical: ms(6), // Using react-native-size-matters for responsive design
    borderRadius: ms(16), // Using react-native-size-matters for responsive design
    borderWidth: 1,
  },
  brandText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - keeping unchanged as requested
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    paddingBottom: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    borderBottomWidth: 1,
  },
  priceContainer: {
    flex: 1,
  },
  promotionPriceContainer: {
    gap: ms(4), // Using react-native-size-matters for responsive design
  },
  currentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: ms(6), // Using react-native-size-matters for responsive design - reduced from 8
  },
  originalPrice: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design - reduced from 18
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: ms(28), // Using react-native-size-matters for responsive design - reduced from 32
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  priceLabel: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
    fontWeight: '500',
  },
  promotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
    paddingVertical: ms(6), // Using react-native-size-matters for responsive design - reduced from 8
    borderRadius: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    gap: ms(4), // Using react-native-size-matters for responsive design
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  promotionIcon: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
  },
  promotionBadgeText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
    fontWeight: '700',
  },
  stockSection: {
    marginBottom: ms(18), // Using react-native-size-matters for responsive design - reduced from 24
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(14), // Using react-native-size-matters for responsive design - reduced from 16
    paddingVertical: ms(8), // Using react-native-size-matters for responsive design - reduced from 10
    borderRadius: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    gap: ms(6), // Using react-native-size-matters for responsive design - reduced from 8
  },
  stockBadgeWarning: {
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockBadgeError: {
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockIndicator: {
    width: ms(8), // Using react-native-size-matters for responsive design
    height: ms(8), // Using react-native-size-matters for responsive design
    borderRadius: ms(4), // Using react-native-size-matters for responsive design
  },
  stockBadgeText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
  },
  quantityLabel: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design - reduced from 18
    fontWeight: '700',
    marginBottom: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    overflow: 'hidden',
    alignSelf: 'flex-start',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  quantityButton: {
    width: ms(44), // Using react-native-size-matters for responsive design - reduced from 52
    height: ms(44), // Using react-native-size-matters for responsive design - reduced from 52
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantityTextContainer: {
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    minWidth: ms(50), // Using react-native-size-matters for responsive design - reduced from 60
    alignItems: 'center',
  },
  quantityText: {
    fontSize: ms(18), // Using react-native-size-matters for responsive design - reduced from 20
    fontWeight: '800',
  },
  totalSection: {
    paddingTop: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    marginBottom: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    borderTopWidth: 1,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design - reduced from 16
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addToCartButton: {
    paddingVertical: ms(14), // Using react-native-size-matters for responsive design - reduced from 16
    borderRadius: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  addToCartButtonActive: {
    elevation: 6,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  addToCartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8), // Using react-native-size-matters for responsive design - reduced from 10
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8), // Using react-native-size-matters for responsive design - reduced from 10
  },
  loadingText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design - reduced from 15
    fontWeight: '600',
  },
  addToCartText: {
    fontSize: ms(15), // Using react-native-size-matters for responsive design - reduced from 16
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quantityButtonText: {
    fontSize: ms(18), // Using react-native-size-matters for responsive design - reduced from 20
    fontWeight: '800',
  },
  cartIcon: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design - reduced from 18
  },
});

export default ProductMainInfoPresenter; 