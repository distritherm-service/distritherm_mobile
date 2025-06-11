import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useColors } from 'src/hooks/useColors';

interface CategoryListSkeletonPresenterProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  shimmerTranslateX: Animated.AnimatedInterpolation<string | number>;
  shimmerOpacity: Animated.AnimatedInterpolation<string | number>;
  itemCount: number;
}

const CategoryListSkeletonPresenter: React.FC<CategoryListSkeletonPresenterProps> = ({
  fadeAnim,
  scaleAnim,
  shimmerTranslateX,
  shimmerOpacity,
  itemCount,
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    scrollViewContent: {
      paddingHorizontal: ms(20),
      gap: ms(16),
    },
    categoryCard: {
      alignItems: 'center',
      width: ms(80),
    },
    imageContainer: {
      width: ms(70),
      height: ms(70),
      borderRadius: ms(35),
      marginBottom: ms(10),
      overflow: 'hidden',
      position: 'relative',
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(1) },
      shadowOpacity: 0.08,
      shadowRadius: ms(4),
      elevation: 2,
    },
    categoryImageSkeleton: {
      width: '100%',
      height: '100%',
      borderRadius: ms(35),
    },
    childrenIndicatorSkeleton: {
      position: 'absolute',
      top: ms(4),
      right: ms(4),
      width: ms(8),
      height: ms(8),
      borderRadius: ms(4),
    },
    categoryNameSkeleton: {
      width: '100%',
      height: ms(12),
      borderRadius: ms(4),
      marginBottom: ms(2),
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

  const SkeletonBox = ({ style, children }: { style: any; children?: React.ReactNode }) => (
    <View style={[dynamicStyles.skeletonBase, style]}>
      <Animated.View
        style={[
          dynamicStyles.shimmerOverlay,
          {
            opacity: shimmerOpacity,
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      />
      {children}
    </View>
  );

  const renderSkeletonItem = (index: number) => (
    <Animated.View
      key={`category-skeleton-${index}`}
      style={[
        dynamicStyles.categoryCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Image Container Skeleton */}
      <View style={dynamicStyles.imageContainer}>
        <SkeletonBox style={dynamicStyles.categoryImageSkeleton}>
          {/* Children Indicator Skeleton */}
          <SkeletonBox style={dynamicStyles.childrenIndicatorSkeleton} />
        </SkeletonBox>
      </View>
      
      {/* Category Name Skeleton */}
      <SkeletonBox style={dynamicStyles.categoryNameSkeleton} />
      <SkeletonBox style={[dynamicStyles.categoryNameSkeleton, { width: '60%', marginTop: ms(2) }]} />
    </Animated.View>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={dynamicStyles.scrollViewContent}
      scrollEnabled={false}
    >
      {Array.from({ length: itemCount }, (_, index) => renderSkeletonItem(index))}
    </ScrollView>
  );
};

export default CategoryListSkeletonPresenter;