import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PromotionsBannerPresenter from "./PromotionsBannerPresenter";
import PromotionsBannerSkeleton from "./PromotionsBannerSkeleton/PromotionsBannerSkeleton";
import promotionBannersService from "src/services/promotionBannersService";

const { width: screenWidth } = Dimensions.get("window");
import { ms } from "react-native-size-matters";

const PromotionsBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const flatlistRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchPromotionBanners = async () => {
      try {
        setIsLoading(true);
        const response = await promotionBannersService.findAll();
        setBanners(response.banners);
        
        // Initialiser les états de chargement des images
        const initialLoadingStates: {[key: string]: boolean} = {};
        response.banners.forEach((banner: any) => {
          initialLoadingStates[banner.id.toString()] = true;
        });
        setImageLoadingStates(initialLoadingStates);
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

  const handleDiscoverPress = () => {
    // Navigate to promotions page or handle discover action
    console.log("Découvrez pressed - Navigate to promotions");
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
    console.error(`Error loading image for banner ${bannerId}`);
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: false
    }));
  };

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
      onDiscoverPress={handleDiscoverPress}
      onScrollEnd={handleScrollEnd}
      onImageLoad={handleImageLoad}
      onImageError={handleImageError}
    />
  );
};

export default PromotionsBanner;

const styles = StyleSheet.create({});
