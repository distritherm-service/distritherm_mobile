import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import CategoryListSkeletonPresenter from './CategoryListSkeletonPresenter';

interface CategoryListSkeletonProps {
  itemCount?: number;
}

const CategoryListSkeleton: React.FC<CategoryListSkeletonProps> = ({ 
  itemCount = 6 
}) => {
  // Animations pour l'effet shimmer
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Interpolations pour l'effet shimmer
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  useEffect(() => {
    // Animation d'entrée
    const entryAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // Animation shimmer continue
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    entryAnimation.start(() => {
      shimmerAnimation.start();
    });

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  return (
    <CategoryListSkeletonPresenter
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      shimmerTranslateX={shimmerTranslateX}
      shimmerOpacity={shimmerOpacity}
      itemCount={itemCount}
    />
  );
};

export default CategoryListSkeleton;