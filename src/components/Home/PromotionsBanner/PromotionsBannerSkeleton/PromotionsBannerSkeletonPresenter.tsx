import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { colors } from 'src/utils/colors';
import { globalStyles } from 'src/utils/globalStyles';

const { width: screenWidth } = Dimensions.get("window");

interface PromotionsBannerSkeletonPresenterProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  shimmerTranslateX: Animated.AnimatedInterpolation<string | number>;
  shimmerOpacity: Animated.AnimatedInterpolation<string | number>;
  pulseDotOpacity: Animated.AnimatedInterpolation<string | number>;
  itemCount: number;
}

const PromotionsBannerSkeletonPresenter: React.FC<PromotionsBannerSkeletonPresenterProps> = ({
  fadeAnim,
  scaleAnim,
  shimmerTranslateX,
  shimmerOpacity,
  pulseDotOpacity,
  itemCount,
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

  const renderSkeletonBanner = (index: number) => (
    <Animated.View
      key={`promotion-skeleton-${index}`}
      style={[
        styles.bannerContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Banner Image Skeleton */}
      <SkeletonBox style={styles.bannerImageSkeleton}>
        {/* Banner Overlay Skeleton */}
        <View style={styles.bannerOverlaySkeleton} />
        
        {/* Discover Button Skeleton */}
        <View style={styles.discoverButtonContainer}>
          <SkeletonBox style={styles.discoverButtonSkeleton}>
            {/* Button Text Skeleton */}
            <SkeletonBox style={styles.discoverTextSkeleton} />
            {/* Button Icon Skeleton */}
            <SkeletonBox style={styles.discoverIconSkeleton} />
          </SkeletonBox>
        </View>
      </SkeletonBox>
    </Animated.View>
  );

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.bannerWrapper}>
        {/* Banner Skeleton */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {Array.from({ length: itemCount }, (_, index) => renderSkeletonBanner(index))}
        </ScrollView>

        {/* Pagination Dots Skeleton */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: itemCount }, (_, index) => (
            <Animated.View
              key={`dot-skeleton-${index}`}
              style={[
                styles.paginationDotSkeleton,
                index === 0 && styles.activePaginationDotSkeleton,
                {
                  opacity: pulseDotOpacity,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default PromotionsBannerSkeletonPresenter;

const styles = StyleSheet.create({
  container: {
    height: ms(240),
    width: "100%",
  },
  bannerWrapper: {
    position: "relative",
    height: "100%",
  },
  scrollViewContent: {
    paddingHorizontal: ms(20),
    gap: ms(16),
  },
  bannerContainer: {
    width: screenWidth - ms(40),
    height: ms(180),
    borderRadius: ms(16),
    overflow: "hidden",
    marginHorizontal: 0,
    position: "relative",
    shadowColor: colors.secondary[400],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerImageSkeleton: {
    width: "100%",
    height: "100%",
    borderRadius: ms(16),
  },
  bannerOverlaySkeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  discoverButtonContainer: {
    position: "absolute",
    bottom: ms(10),
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  discoverButtonSkeleton: {
    width: ms(120),
    height: ms(32),
    borderRadius: ms(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  discoverTextSkeleton: {
    width: ms(70),
    height: ms(14),
    borderRadius: ms(4),
    marginRight: ms(6),
  },
  discoverIconSkeleton: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: ms(16),
    marginBottom: ms(8),
  },
  paginationDotSkeleton: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.tertiary[200],
    marginHorizontal: ms(4),
  },
  activePaginationDotSkeleton: {
    backgroundColor: colors.primary[400],
    transform: [{ scale: 1.2 }],
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
    opacity: 0.7,
  },
}); 