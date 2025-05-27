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
import { colors } from "src/utils/colors";
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
  return (
    <Pressable
      style={[styles.container, isTabletDevice && styles.containerTablet]}
      onPress={onPress}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[
            styles.productImage,
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
              isTabletDevice && styles.productImageTablet,
            ]}
          >
            <Text style={styles.loadingText}>📦</Text>
          </View>
        )}

        {/* Promotion Badge */}
        {promotionPercentage && (
          <View style={styles.promotionBadge}>
            <Text style={styles.promotionText}>-{promotionPercentage}%</Text>
          </View>
        )}

        {/* Favorite Button */}
        <Pressable
          style={[
            styles.favoriteButton,
            isFavorited && styles.favoriteButtonActive,
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
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {/* Price Container */}
        <View style={styles.priceContainer}>
          <View style={styles.priceBackground}>
            <Text style={styles.price}>{price.toFixed(2)} €</Text>
            <Text style={styles.unit}>/{unit}</Text>
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
              { color: inStock ? colors.secondary[500] : colors.tertiary[500] },
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
    backgroundColor: colors.primary[50],
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: ms(16),
    shadowColor: colors.tertiary[800],
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
    borderColor: colors.secondary[100],
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
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[100],
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
    backgroundColor: colors.secondary[50],
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
    backgroundColor: colors.secondary[500],
    paddingHorizontal: ms(10),
    paddingVertical: ms(6),
    borderRadius: ms(16),
    shadowColor: colors.tertiary[800],
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
    color: colors.primary[50],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: "absolute",
    top: ms(0),
    right: ms(0),
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.tertiary[800],
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.secondary[100],
  },
  favoriteButtonActive: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[400],
    shadowColor: colors.secondary[500],
    shadowOpacity: 0.3,
  },
  stockIndicator: {
    position: "absolute",
    bottom: ms(12),
    right: ms(12),
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    borderWidth: 2,
    borderColor: colors.primary[50],
    shadowColor: colors.tertiary[800],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    paddingHorizontal: ms(6),
    zIndex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.secondary[50],
    paddingHorizontal: ms(8),
    paddingVertical: ms(3),
    borderRadius: ms(8),
    alignSelf: "flex-start",
    marginBottom: ms(8),
    borderWidth: 1,
    borderColor: colors.secondary[100],
  },
  category: {
    fontSize: ms(9),
    color: colors.secondary[500],
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  productName: {
    fontSize: ms(13),
    fontWeight: "700",
    color: colors.tertiary[700],
    lineHeight: ms(17),
    marginBottom: ms(12),
  },
  priceContainer: {
    marginBottom: ms(10),
  },
  priceBackground: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "flex-start",
    backgroundColor: colors.secondary[500],
    paddingHorizontal: ms(12),
    paddingVertical: ms(3),
    borderRadius: ms(12),
    shadowColor: colors.tertiary[800],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  price: {
    fontSize: ms(14),
    fontWeight: "800",
    color: colors.primary[50],
  },
  unit: {
    fontSize: ms(10),
    color: colors.primary[100],
    marginLeft: ms(3),
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[100],
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(8),
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.secondary[100],
  },
  stockDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: ms(8),
  },
  stockStatus: {
    fontSize: ms(9),
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
