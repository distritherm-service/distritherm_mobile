import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import PromotionsBannerSkeletonPresenter from './PromotionsBannerSkeletonPresenter';

interface PromotionsBannerSkeletonProps {
  itemCount?: number;
}

const PromotionsBannerSkeleton: React.FC<PromotionsBannerSkeletonProps> = ({ 
  itemCount = 3 
}) => {
  // Animations pour l'effet shimmer
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseDotAnim = useRef(new Animated.Value(0.5)).current;

  // Interpolations pour l'effet shimmer
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  // Animation pour les dots de pagination
  const pulseDotOpacity = pulseDotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  useEffect(() => {
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
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation pulse pour les dots
    const pulseDotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseDotAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseDotAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    entryAnimation.start(() => {
      shimmerAnimation.start();
      pulseDotAnimation.start();
    });

    return () => {
      shimmerAnimation.stop();
      pulseDotAnimation.stop();
    };
  }, []);

  return (
    <PromotionsBannerSkeletonPresenter
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      shimmerTranslateX={shimmerTranslateX}
      shimmerOpacity={shimmerOpacity}
      pulseDotOpacity={pulseDotOpacity}
      itemCount={itemCount}
    />
  );
};

export default PromotionsBannerSkeleton; 