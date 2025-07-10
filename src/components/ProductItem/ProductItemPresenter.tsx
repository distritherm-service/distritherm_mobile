import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

interface ProductItemPresenterProps {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  imageSource: ImageSourcePropType;
  inStock: boolean;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoritePress?: () => void;
  discountType?: 'pro' | 'promotion' | null;
  discountPercentage?: number | null;
  isTabletDevice: boolean;
  imageError: boolean;
  isLoading: boolean;
  onImageError: () => void;
  onImageLoad: () => void;
}

const ProductItemPresenter: React.FC<ProductItemPresenterProps> = ({
  name,
  category,
  price,
  originalPrice,
  unit,
  imageSource,
  inStock,
  onPress,
  isFavorited = false,
  onFavoritePress,
  discountType,
  discountPercentage,
  isTabletDevice,
  imageError,
  isLoading,
  onImageError,
  onImageLoad,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.text,
    },
    productImage: {
      backgroundColor: colors.background,
      borderColor: colors.borderDark,
    },
    loadingOverlay: {
      backgroundColor: colors.surface,
    },
    loadingText: {
      color: colors.textSecondary,
    },
    promotionBadge: {
      backgroundColor: colors.accent[500],
      shadowColor: colors.accent[900],
    },
    proBadge: {
      backgroundColor: colors.success[500],
      shadowColor: colors.success[900],
    },
    badgeText: {
      color: colors.surface,
    },
    favoriteButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    favoriteButtonActive: {
      backgroundColor: colors.accent[500],
      borderColor: colors.accent[600],
    },
    favoriteIcon: {
      color: isFavorited ? colors.surface : colors.textSecondary,
    },
    categoryText: {
      color: colors.secondary[600],
    },
    productName: {
      color: colors.text,
    },
    priceBackground: {
      backgroundColor: colors.secondary[50],
    },
    price: {
      color: colors.secondary[700],
    },
    originalPrice: {
      color: colors.textSecondary,
    },
    unit: {
      color: colors.textSecondary,
    },
    stockDot: {
      backgroundColor: inStock ? colors.success[500] : colors.danger[500],
    },
    stockText: {
      color: inStock ? colors.success[600] : colors.danger[600],
    },
  };

  const getBadgeStyle = () => {
    if (discountType === 'pro') {
      return [styles.discountBadge, dynamicStyles.proBadge];
    } else if (discountType === 'promotion') {
      return [styles.discountBadge, dynamicStyles.promotionBadge];
    }
    return null;
  };

  const getBadgeIcon = () => {
    if (discountType === 'pro') {
      return '👨‍💼'; // Professional icon
    } else if (discountType === 'promotion') {
      return '🔥'; // Fire icon for promotion
    }
    return '';
  };

  return (
    <Pressable
      style={[
        styles.container, 
        dynamicStyles.container,
        isTabletDevice && styles.containerTablet
      ]}
      onPress={onPress}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[
            styles.productImage,
            dynamicStyles.productImage,
            isTabletDevice && styles.productImageTablet,
          ]}
          onError={onImageError}
          onLoad={onImageLoad}
          resizeMode="cover"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View
            style={[
              styles.loadingOverlay,
              dynamicStyles.loadingOverlay,
              isTabletDevice && styles.productImageTablet,
            ]}
          >
            <Text style={[styles.loadingText, dynamicStyles.loadingText]}>📦</Text>
          </View>
        )}

        {/* Discount Badge - Pro (Green) or Promotion (Red) */}
        {discountPercentage && discountType && (
          <View style={getBadgeStyle()}>
            <Text style={[styles.badgeIcon, dynamicStyles.badgeText]}>
              {getBadgeIcon()}
            </Text>
            <Text style={[styles.badgeText, dynamicStyles.badgeText]}>
              -{discountPercentage}%
            </Text>
          </View>
        )}

        {/* Favorite Button */}
        <Pressable
          style={[
            styles.favoriteButton,
            dynamicStyles.favoriteButton,
            isFavorited && [styles.favoriteButtonActive, dynamicStyles.favoriteButtonActive],
          ]}
          onPress={onFavoritePress}
        >
          <FontAwesomeIcon
            icon={isFavorited ? faHeartSolid : faHeart}
            size={ms(16)}
            color={dynamicStyles.favoriteIcon.color}
          />
        </Pressable>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Category */}
        <View style={styles.categoryContainer}>
          <Text style={[styles.category, dynamicStyles.categoryText]} numberOfLines={1}>
            {category}
          </Text>
        </View>

        {/* Product Name */}
        <Text style={[styles.productName, dynamicStyles.productName]} numberOfLines={2}>
          {name}
        </Text>

        {/* Price Container */}
        <View style={styles.priceContainer}>
          <View style={[styles.priceBackground, dynamicStyles.priceBackground]}>
            {originalPrice && (
              <Text style={[styles.originalPrice, dynamicStyles.originalPrice]}>
                {originalPrice.toFixed(2)} €
              </Text>
            )}
            <View style={styles.priceRow}>
              <Text style={[styles.price, dynamicStyles.price]}>
                {price.toFixed(2)} €
              </Text>
              <Text style={[styles.unit, dynamicStyles.unit]}>/{unit}</Text>
            </View>
          </View>
        </View>

        {/* Stock Status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.stockDot,
              dynamicStyles.stockDot,
            ]}
          />
          <Text style={[styles.stockStatus, dynamicStyles.stockText]}>
            {inStock ? "En stock" : "Rupture"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductItemPresenter;

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: ms(16),
    shadowOffset: {
      width: 0,
      height: ms(4),
    },
    shadowOpacity: Platform.select({
      ios: 0.12,
      android: 0.15,
    }),
    shadowRadius: ms(12),
    elevation: 8,
    borderWidth: 1,
    width: "100%",
    overflow: "hidden",
    position: "relative"
  },
  containerTablet: {
    padding: ms(16),
    borderRadius: ms(20),
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    marginBottom: ms(12),
  },
  productImage: {
    width: "100%",
    height: ms(160),
    borderRadius: ms(12),
    borderWidth: 1,
  },
  productImageTablet: {
    height: ms(200),
    borderRadius: ms(16),
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ms(12),
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: ms(32),
  },
  discountBadge: {
    position: "absolute",
    top: ms(8),
    left: ms(8),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(16),
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeIcon: {
    fontSize: ms(8),
    marginRight: ms(4),
  },
  badgeText: {
    fontSize: ms(10),
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: "absolute",
    top: ms(8),
    right: ms(8),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
  },
  favoriteButtonActive: {
    borderWidth: 2,
  },
  contentContainer: {
    paddingHorizontal: ms(4),
    gap: ms(8),
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ms(4),
  },
  category: {
    fontSize: ms(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: ms(0.8),
  },
  productName: {
    fontSize: ms(15),
    fontWeight: "700",
    lineHeight: ms(20),
    marginBottom: ms(8),
  },
  priceContainer: {
    alignItems: "flex-start",
    marginBottom: ms(8),
  },
  priceBackground: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: ms(10),
    paddingVertical: ms(6),
    borderRadius: ms(12),
  },
  originalPrice: {
    fontSize: ms(12),
    fontWeight: "500",
    textDecorationLine: "line-through",
    marginRight: ms(6),
  },
  price: {
    fontSize: ms(16),
    fontWeight: "800",
    letterSpacing: ms(-0.2),
  },
  unit: {
    fontSize: ms(12),
    fontWeight: "500",
    marginLeft: ms(3),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: ms(8),
  },
  stockStatus: {
    fontSize: ms(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: ms(0.3),
  },
});
