import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PromotionsBannerPresenter from "./PromotionsBannerPresenter";
import promotionBannersService from "src/services/promotionBannersService";

const { width: screenWidth } = Dimensions.get("window");
import { ms } from "react-native-size-matters";

const PromotionsBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatlistRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchPromotionBanners = async () => {
      try {
        const response = await promotionBannersService.findAll();
        setBanners(response.banners);
      } catch (error) {
        console.error("Error fetching promotion banners:", error);
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

  return (
    <PromotionsBannerPresenter 
      banners={banners} 
      flatlistRef={flatlistRef}
      currentIndex={currentIndex}
      onDiscoverPress={handleDiscoverPress}
      onScrollEnd={handleScrollEnd}
    />
  );
};

export default PromotionsBanner;

const styles = StyleSheet.create({});
