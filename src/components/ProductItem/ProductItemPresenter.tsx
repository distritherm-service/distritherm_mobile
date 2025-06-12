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
  unit: string;
  imageSource: ImageSourcePropType;
  inStock: boolean;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoritePress?: () => void;
  promotionPercentage?: number;
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
  unit,
  imageSource,
  inStock,
  onPress,
  isFavorited = false,
  onFavoritePress,
  promotionPercentage,
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
      backgroundColor: colors.primary[50],
      borderColor: colors.secondary[100],
      shadowColor: colors.tertiary[800],
    },
    productImage: {
      backgroundColor: colors.secondary[50],
      borderColor: colors.secondary[100],
    },
    loadingOverlay: {
      backgroundColor: colors.secondary[50],
    },
    promotionBadge: {
      backgroundColor: colors.secondary[500],
      shadowColor: colors.tertiary[800],
    },
    promotionText: {
      color: colors.primary[50],
    },
    favoriteButton: {
      backgroundColor: colors.primary[50],
      borderColor: colors.secondary[200],
    },
    favoriteButtonActive: {
      backgroundColor: colors.secondary[500],
      borderColor: colors.secondary[600],
    },
    categoryText: {
      color: colors.secondary[600],
    },
    productName: {
      color: colors.tertiary[700],
    },
    price: {
      color: colors.secondary[600],
    },
    unit: {
      color: colors.tertiary[500],
    },
    stockText: {
      color: colors.secondary[500],
    },
    stockTextOutOfStock: {
      color: colors.tertiary[500],
    },
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
            <Text style={styles.loadingText}>📦</Text>
          </View>
        )}

        {/* Promotion Badge */}
        {promotionPercentage && (
          <View style={[styles.promotionBadge, dynamicStyles.promotionBadge]}>
            <Text style={[styles.promotionText, dynamicStyles.promotionText]}>-{promotionPercentage}%</Text>
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
            color={isFavorited ? colors.primary[50] : colors.secondary[400]}
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
          <View style={styles.priceBackground}>
            <Text style={[styles.price, dynamicStyles.price]}>{price.toFixed(2)} €</Text>
            <Text style={[styles.unit, dynamicStyles.unit]}>/{unit}</Text>
          </View>
        </View>

        {/* Stock Status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.stockDot,
              {
                backgroundColor: inStock
                  ? colors.secondary[400]
                  : colors.tertiary[400],
              },
            ]}
          />
          <Text
            style={[
              styles.stockStatus,
              inStock ? dynamicStyles.stockText : dynamicStyles.stockTextOutOfStock,
            ]}
          >
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
    position: "relative",
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
  promotionBadge: {
    position: "absolute",
    top: ms(5),
    left: ms(5),
    paddingHorizontal: ms(10),
    paddingVertical: ms(6),
    borderRadius: ms(16),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  promotionText: {
    fontSize: ms(9),
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: "absolute",
    top: ms(5),
    right: ms(5),
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
    paddingHorizontal: ms(2),
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
    fontSize: ms(14),
    fontWeight: "700",
    lineHeight: ms(18),
    marginBottom: ms(8),
  },
  priceContainer: {
    alignItems: "flex-start",
    marginBottom: ms(8),
  },
  priceBackground: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(12),
  },
  price: {
    fontSize: ms(16),
    fontWeight: "800",
    letterSpacing: ms(-0.2),
  },
  unit: {
    fontSize: ms(11),
    fontWeight: "500",
    marginLeft: ms(2),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    marginRight: ms(6),
  },
  stockStatus: {
    fontSize: ms(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: ms(0.3),
  },
});
