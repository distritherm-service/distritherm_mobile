import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { colors } from 'src/utils/colors';

interface ProductItemSkeletonPresenterProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  shimmerTranslateX: Animated.AnimatedInterpolation<string | number>;
  shimmerOpacity: Animated.AnimatedInterpolation<string | number>;
  isTabletDevice: boolean;
}

const ProductItemSkeletonPresenter: React.FC<ProductItemSkeletonPresenterProps> = ({
  fadeAnim,
  scaleAnim,
  shimmerTranslateX,
  shimmerOpacity,
  isTabletDevice,
}) => {
  const SkeletonBox = ({ style, children }: { style: any; children?: React.ReactNode }) => (
    <View style={[styles.skeletonBase, style]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            opacity: shimmerOpacity,
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      />
      {children}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        isTabletDevice && styles.containerTablet,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Image Container Skeleton */}
      <View style={styles.imageContainer}>
        <SkeletonBox 
          style={[
            styles.productImageSkeleton,
            isTabletDevice && styles.productImageSkeletonTablet,
          ]}
        >
          {/* Favorite Button Skeleton */}
          <SkeletonBox style={styles.favoriteButtonSkeleton} />
          
          {/* Promotion Badge Skeleton (optionnel) */}
          <SkeletonBox style={styles.promotionBadgeSkeleton} />
        </SkeletonBox>
      </View>

      {/* Content Container Skeleton */}
      <View style={styles.contentContainer}>
        {/* Category Skeleton */}
        <SkeletonBox style={styles.categorySkeleton} />

        {/* Product Name Skeleton */}
        <SkeletonBox style={styles.productNameSkeleton} />
        <SkeletonBox style={[styles.productNameSkeleton, { width: '60%', marginTop: ms(4) }]} />

        {/* Price Container Skeleton */}
        <SkeletonBox style={styles.priceSkeleton} />

        {/* Stock Status Skeleton */}
        <View style={styles.statusContainer}>
          <SkeletonBox style={styles.stockDotSkeleton} />
          <SkeletonBox style={styles.stockStatusSkeleton} />
        </View>
      </View>
    </Animated.View>
  );
};

export default ProductItemSkeletonPresenter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: ms(16),
    shadowColor: colors.tertiary[300],
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: Platform.select({
      ios: 0.04,
      android: 0.06,
    }),
    shadowRadius: ms(8),
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary[200],
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  containerTablet: {
    padding: ms(16),
    borderRadius: ms(20),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: ms(12),
  },
  productImageSkeleton: {
    width: '100%',
    height: ms(160),
    borderRadius: ms(12),
  },
  productImageSkeletonTablet: {
    height: ms(200),
    borderRadius: ms(16),
  },
  favoriteButtonSkeleton: {
    position: 'absolute',
    top: ms(0),
    right: ms(0),
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
  },
  promotionBadgeSkeleton: {
    position: 'absolute',
    top: ms(5),
    left: ms(5),
    width: ms(50),
    height: ms(24),
    borderRadius: ms(16),
  },
  contentContainer: {
    paddingHorizontal: ms(6),
  },
  categorySkeleton: {
    width: ms(80),
    height: ms(20),
    borderRadius: ms(8),
    marginBottom: ms(8),
  },
  productNameSkeleton: {
    width: '100%',
    height: ms(16),
    borderRadius: ms(4),
    marginBottom: ms(4),
  },
  priceSkeleton: {
    width: ms(100),
    height: ms(28),
    borderRadius: ms(12),
    marginBottom: ms(10),
    marginTop: ms(8),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDotSkeleton: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: ms(8),
  },
  stockStatusSkeleton: {
    width: ms(60),
    height: ms(14),
    borderRadius: ms(4),
  },
  skeletonBase: {
    backgroundColor: colors.primary[200],
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[100],
    opacity: 0.8,
  },
});
