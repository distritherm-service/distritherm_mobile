import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import PromotionsBannerSkeletonPresenter from './PromotionsBannerSkeletonPresenter';

interface PromotionsBannerSkeletonProps {
  itemCount?: number;
}

const PromotionsBannerSkeleton: React.FC<PromotionsBannerSkeletonProps> = ({ 
  itemCount = 1
}) => {
  // Animations pour l'effet shimmer
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Interpolations pour l'effet shimmer
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  useEffect(() => {
    let shimmerAnimation: Animated.CompositeAnimation;

    // Animation d'entrée
    const entryAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // Animation shimmer continue
    shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    entryAnimation.start(() => {
      shimmerAnimation.start();
    });

    return () => {
      if (shimmerAnimation) {
        shimmerAnimation.stop();
      }
    };
  }, [shimmerAnim, fadeAnim, scaleAnim]);

  return (
    <PromotionsBannerSkeletonPresenter
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      shimmerTranslateX={shimmerTranslateX}
      shimmerOpacity={shimmerOpacity}
      itemCount={itemCount}
    />
  );
};

export default PromotionsBannerSkeleton; 