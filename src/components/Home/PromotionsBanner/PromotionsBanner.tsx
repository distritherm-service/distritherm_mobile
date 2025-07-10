import { FlatList, StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PromotionsBannerPresenter from "./PromotionsBannerPresenter";
import PromotionsBannerSkeleton from "./PromotionsBannerSkeleton/PromotionsBannerSkeleton";
import promotionBannersService, { PromotionBannerDto } from "src/services/promotionBannersService";
import { ms } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

const PromotionsBanner = () => {
  const [banners, setBanners] = useState<PromotionBannerDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const [shimmerAnimations, setShimmerAnimations] = useState<{[key: string]: Animated.Value}>({});
  const flatlistRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPromotionBanners = async () => {
      try {
        setIsLoading(true);
        const response = await promotionBannersService.findAll();
        setBanners(response.banners);
        
        // Initialiser les états de chargement des images et les animations
        const initialLoadingStates: {[key: string]: boolean} = {};
        const initialAnimations: {[key: string]: Animated.Value} = {};
        response.banners.forEach((banner: any) => {
          const bannerId = banner.id.toString();
          initialLoadingStates[bannerId] = true;
          initialAnimations[bannerId] = new Animated.Value(0);
        });
        setImageLoadingStates(initialLoadingStates);
        setShimmerAnimations(initialAnimations);
      } catch (error) {
        console.error("Error fetching promotion banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotionBanners();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        
        // Scroll to next banner
        flatlistRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        
        return nextIndex;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle shimmer animations for loading images
  useEffect(() => {
    Object.keys(imageLoadingStates).forEach(bannerId => {
      if (imageLoadingStates[bannerId] && shimmerAnimations[bannerId]) {
        const shimmerAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnimations[bannerId], {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnimations[bannerId], {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
      }
    });
  }, [imageLoadingStates, shimmerAnimations]);

  const handleDiscoverPress = (promotionBanner: PromotionBannerDto) => {
    if (promotionBanner?.promotion?.productId) {
      navigation.navigate("Product", { productId: promotionBanner.promotion.productId });
    }
  };

  // Handle manual scroll to update currentIndex
  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const bannerWidth = screenWidth - ms(40); // ms(40) = 40 for padding
    const pageNum = Math.round(contentOffset.x / bannerWidth);
    
    if (pageNum >= 0 && pageNum < banners.length) {
      setCurrentIndex(pageNum);
    }
  };

  // Gérer le chargement des images
  const handleImageLoad = (bannerId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: false
    }));
  };

  const handleImageError = (bannerId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: false
    }));
  };

  const handleClickViewAll = () => {
    navigation.navigate("Promotions");
  }

  // Afficher le skeleton pendant le chargement initial
  if (isLoading) {
    return <PromotionsBannerSkeleton itemCount={2} />;
  }

  return (
    <PromotionsBannerPresenter 
      banners={banners} 
      flatlistRef={flatlistRef}
      currentIndex={currentIndex}
      imageLoadingStates={imageLoadingStates}
      shimmerAnimations={shimmerAnimations}
      onDiscoverPress={handleDiscoverPress}
      onScrollEnd={handleScrollEnd}
      onImageLoad={handleImageLoad}
      onImageError={handleImageError}
      onViewAllPress={handleClickViewAll}
    />
  );
};

export default PromotionsBanner;

const styles = StyleSheet.create({});
