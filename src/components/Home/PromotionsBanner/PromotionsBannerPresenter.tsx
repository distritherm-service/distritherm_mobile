import { StyleSheet, View, FlatList, Image, Dimensions } from "react-native";
import React from "react";
import { globalStyles } from "src/utils/globalStyles";
import { PromotionBannerDto } from "src/services/promotionBannersService";
import { ms } from "react-native-size-matters";

interface PromotionsBannerPresenterProps {
  banners: PromotionBannerDto[];
}
const { width: screenWidth } = Dimensions.get("window");

const PromotionBannerItem = ({ item }: { item: PromotionBannerDto }) => {
  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );
};

const PromotionsBannerPresenter = ({
  banners,
}: PromotionsBannerPresenterProps) => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <FlatList
        data={banners}
        renderItem={({ item }) => <PromotionBannerItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
      />
    </View>
  );
};

export default PromotionsBannerPresenter;

const styles = StyleSheet.create({
  container: {
    height: ms(200),
    width: "100%",
  },
  bannerContainer: {
    width: screenWidth - ms(40),
    height: ms(180),
    borderRadius: ms(10),
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
