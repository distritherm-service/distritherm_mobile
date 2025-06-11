import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ms, s, vs } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { ProductDetailDto } from 'src/types/Product';
import { useColors } from 'src/hooks/useColors';

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getStockBadge = () => {
    if (isOutOfStock) {
      return (
        <View style={[styles.stockBadge, { backgroundColor: colors.error }]}>
          <Text style={[styles.stockBadgeText, { color: colors.primary[50] }]}>
            Rupture de stock
          </Text>
        </View>
      );
    }
    
    if (isLowStock) {
      return (
        <View style={[styles.stockBadge, { backgroundColor: '#FF8C00' }]}>
          <Text style={[styles.stockBadgeText, { color: colors.primary[50] }]}>
            Stock limité ({product.quantity} restant{product.quantity > 1 ? 's' : ''})
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.stockBadge, { backgroundColor: colors.success }]}>
        <Text style={[styles.stockBadgeText, { color: colors.primary[50] }]}>
          En stock ({product.quantity} disponible{product.quantity > 1 ? 's' : ''})
        </Text>
      </View>
    );
  };

  const getPromotionBadge = () => {
    if (product.isInPromotion && product.promotionPercentage) {
      return (
        <View style={[styles.promotionBadge, { backgroundColor: colors.error }]}>
          <Text style={[styles.promotionBadgeText, { color: colors.primary[50] }]}>
            -{product.promotionPercentage}%
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Product Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {product.name}
        </Text>
        
        {/* Category and Brand */}
        <View style={styles.metaInfo}>
          {product.category && (
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {product.category.name}
            </Text>
          )}
          {product.mark && (
            <Text style={[styles.brandText, { color: colors.secondary[400] }]}>
              • {product.mark.name}
            </Text>
          )}
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.priceContainer}>
          {product.isInPromotion && product.promotionPrice ? (
            <View style={styles.promotionPriceContainer}>
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                {formatPrice(product.priceTtc)}
              </Text>
              <Text style={[styles.currentPrice, { color: colors.error }]}>
                {formatPrice(product.promotionPrice)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.currentPrice, { color: colors.text }]}>
              {formatPrice(product.priceTtc)}
            </Text>
          )}
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
            TTC
          </Text>
        </View>
        {getPromotionBadge()}
      </View>

      {/* Stock Status */}
      <View style={styles.stockSection}>
        {getStockBadge()}
      </View>

      {/* Quantity Section */}
      {hasStock && (
        <View style={styles.quantitySection}>
          <Text style={[styles.quantityLabel, { color: colors.text }]}>
            Quantité
          </Text>
          <View style={[styles.quantityContainer, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: colors.primary[100] },
                quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={onDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: quantity <= 1 ? colors.textSecondary : colors.secondary[400] }
                ]}
              >
                −
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.quantityText, { color: colors.text }]}>
              {quantity}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: colors.primary[100] },
                quantity >= product.quantity && styles.quantityButtonDisabled,
              ]}
              onPress={onIncreaseQuantity}
              disabled={quantity >= product.quantity}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: quantity >= product.quantity ? colors.textSecondary : colors.secondary[400] }
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Total Price */}
      {hasStock && quantity > 1 && (
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Total:
          </Text>
          <Text style={[styles.totalPrice, { color: colors.secondary[400] }]}>
            {formatPrice(totalPrice)}
          </Text>
        </View>
      )}

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={[
          styles.addToCartButton,
          {
            backgroundColor: isOutOfStock
              ? colors.textSecondary
              : colors.secondary[400],
          },
        ]}
        onPress={onAddToCart}
        disabled={isOutOfStock || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary[50]} size="small" />
        ) : (
          <View style={styles.addToCartContent}>
            <Text style={[styles.cartIcon, { color: colors.primary[50] }]}>
              🛒
            </Text>
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
    paddingHorizontal: s(20), // Using react-native-size-matters for responsive design
    paddingVertical: vs(16), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    marginHorizontal: s(16), // Using react-native-size-matters for responsive design
    marginVertical: vs(8), // Using react-native-size-matters for responsive design
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  titleSection: {
    marginBottom: vs(16), // Using react-native-size-matters for responsive design
  },
  productName: {
    fontSize: ms(24), // Using react-native-size-matters for responsive design
    fontWeight: '700',
    lineHeight: ms(30), // Using react-native-size-matters for responsive design
    marginBottom: vs(8), // Using react-native-size-matters for responsive design
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '500',
  },
  brandText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    marginLeft: s(4), // Using react-native-size-matters for responsive design
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(16), // Using react-native-size-matters for responsive design
  },
  priceContainer: {
    flex: 1,
  },
  promotionPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8), // Using react-native-size-matters for responsive design
  },
  originalPrice: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: ms(28), // Using react-native-size-matters for responsive design
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design
    fontWeight: '400',
    marginTop: vs(2), // Using react-native-size-matters for responsive design
  },
  promotionBadge: {
    paddingHorizontal: s(8), // Using react-native-size-matters for responsive design
    paddingVertical: vs(4), // Using react-native-size-matters for responsive design
    borderRadius: ms(6), // Using react-native-size-matters for responsive design
  },
  promotionBadgeText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design
    fontWeight: '700',
  },
  stockSection: {
    marginBottom: vs(20), // Using react-native-size-matters for responsive design
  },
  stockBadge: {
    paddingHorizontal: s(12), // Using react-native-size-matters for responsive design
    paddingVertical: vs(6), // Using react-native-size-matters for responsive design
    borderRadius: ms(20), // Using react-native-size-matters for responsive design
    alignSelf: 'flex-start',
  },
  stockBadgeText: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: vs(16), // Using react-native-size-matters for responsive design
  },
  quantityLabel: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    marginBottom: vs(8), // Using react-native-size-matters for responsive design
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: ms(8), // Using react-native-size-matters for responsive design
    overflow: 'hidden',
  },
  quantityButton: {
    width: s(44), // Using react-native-size-matters for responsive design
    height: vs(44), // Using react-native-size-matters for responsive design
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: ms(18), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    minWidth: s(60), // Using react-native-size-matters for responsive design
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20), // Using react-native-size-matters for responsive design
    paddingTop: vs(16), // Using react-native-size-matters for responsive design
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design
    fontWeight: '700',
  },
  addToCartButton: {
    paddingVertical: vs(16), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  addToCartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8), // Using react-native-size-matters for responsive design
  },
  addToCartText: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontWeight: '600',
  },
  quantityButtonText: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design
    fontWeight: '700',
  },
  cartIcon: {
    fontSize: ms(18), // Using react-native-size-matters for responsive design
  },
});

export default ProductMainInfoPresenter; 