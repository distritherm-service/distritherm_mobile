import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import ProductItemSkeletonPresenter from './ProductItemSkeletonPresenter';
import { isTablet } from 'src/utils/deviceUtils';

interface ProductItemSkeletonProps {
  animationDelay?: number;
}

const ProductItemSkeleton: React.FC<ProductItemSkeletonProps> = ({ 
  animationDelay = 0 
}) => {
  // Animations pour l'effet shimmer
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Logique métier
  const isTabletDevice = isTablet();

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
    // Animation d'entrée avec délai
    const entryAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: animationDelay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: animationDelay,
        useNativeDriver: true,
      }),
    ]);

    // Animation shimmer continue
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
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
  }, [animationDelay]);

  return (
    <ProductItemSkeletonPresenter
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      shimmerTranslateX={shimmerTranslateX}
      shimmerOpacity={shimmerOpacity}
      isTabletDevice={isTabletDevice}
    />
  );
};

export default ProductItemSkeleton;