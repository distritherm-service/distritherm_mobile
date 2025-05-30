import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import colors from "src/utils/colors";
import { globalStyles } from 'src/utils/globalStyles';

interface PromotionsBannerSkeletonPresenterProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  shimmerTranslateX: Animated.AnimatedInterpolation<string | number>;
  shimmerOpacity: Animated.AnimatedInterpolation<string | number>;
  itemCount: number;
}

const { width: screenWidth } = Dimensions.get("window");

const PromotionsBannerSkeletonPresenter: React.FC<PromotionsBannerSkeletonPresenterProps> = ({
  fadeAnim,
  scaleAnim,
  shimmerTranslateX,
  shimmerOpacity,
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
      <SkeletonBox style={styles.bannerImageSkeleton}>
        <View style={styles.discoverButtonContainer}>
          <SkeletonBox style={styles.discoverButtonSkeleton} />
        </View>
      </SkeletonBox>
    </Animated.View>
  );

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.bannerWrapper}>
        <View style={styles.bannersContainer}>
          {renderSkeletonBanner(0)}
        </View>

        <View style={styles.paginationContainer}>
          {Array.from({ length: itemCount }, (_, index) => (
            <SkeletonBox
              key={`dot-skeleton-${index}`}
              style={[
                styles.paginationDotSkeleton,
                index === 0 && styles.activePaginationDotSkeleton,
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
  bannersContainer: {
    height: ms(180),
  },
  bannerContainer: {
    width: screenWidth - ms(40),
    height: ms(180),
    borderRadius: ms(16),
    overflow: "hidden",
    marginHorizontal: 0,
    position: "relative",
  },
  bannerImageSkeleton: {
    width: "100%",
    height: "100%",
    borderRadius: ms(16),
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
    width: ms(100),
    height: ms(32),
    borderRadius: ms(20),
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
    marginHorizontal: ms(4),
  },
  activePaginationDotSkeleton: {
    transform: [{ scale: 1.2 }],
  },
  skeletonBase: {
    backgroundColor: colors.primary?.[200] || '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary?.[100] || '#F3F4F6',
    opacity: 0.7,
  },
}); 