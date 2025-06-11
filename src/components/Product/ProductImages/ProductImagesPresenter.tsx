import React from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design

interface ProductImagesPresenterProps {
  images: string[];
}

import { Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const ProductImagesPresenter: React.FC<ProductImagesPresenterProps> = ({
  images,
}) => {
  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="stretch" />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductImagesPresenter;

const styles = StyleSheet.create({
  container: {
    height: ms(200),
  },
  image: {
    width: "100%",
    height: ms(200),
    backgroundColor: "red",
  },
});
