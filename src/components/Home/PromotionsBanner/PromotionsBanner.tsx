import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import PromotionsBannerPresenter from "./PromotionsBannerPresenter";
import promotionBannersService from "src/services/promotionBannersService";

const PromotionsBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchPromotionBanners = async () => {
      try {
        const response = await promotionBannersService.findAll();
        setBanners(response.banners);
        console.log("Promotion banners:", response);
      } catch (error) {
        console.error("Error fetching promotion banners:", error);
      }
    };

    fetchPromotionBanners();
  }, []);

  return <PromotionsBannerPresenter banners={banners} />;
};

export default PromotionsBanner;

const styles = StyleSheet.create({});
