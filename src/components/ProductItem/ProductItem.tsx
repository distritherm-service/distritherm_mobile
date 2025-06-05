import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ProductItemPresenter from "./ProductItemPresenter";
import { ProductBasicDto } from "src/types/Product";
import { isTablet } from "src/utils/deviceUtils";
import { NO_IMAGE_URL } from "src/utils/noImage";

interface ProductItemProps {
  product?: ProductBasicDto;
  onProductPress?: (productId: number) => void;
  onFavoritePress?: (product: ProductBasicDto) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onProductPress,
  onFavoritePress,
}) => {
  // États pour la gestion de l'image
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Logique métier
  const isTabletDevice = isTablet();
  // Données d'exemple pour un produit de construction
  const defaultProduct: ProductBasicDto = {
    id: 1,
    name: "Plaque de plâtre BA13 standard",
    priceTtc: 8.5,
    quantity: 10,
    imagesUrl: [],
    description: "Plaque de plâtre standard pour cloisons",
    categoryId: 1,
    markId: 1,
    category: {
      id: 1,
      name: "Plâtrerie",
    },
    isInPromotion: false,
    promotionPrice: undefined,
    promotionEndDate: undefined,
    promotionPercentage: undefined,
    isFavorited: false,
  };

  const currentProduct = product || defaultProduct;

  // Handlers pour l'image
  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getImageSource = () => {
    // if (imageError || !currentProduct.imagesUrl?.[0]) {
    //   return { uri: DEFAULT_IMAGE_URL };
    // }
    return { uri: NO_IMAGE_URL };
    // return { uri: currentProduct.imagesUrl[0] };
  };

  // Handlers pour les actions
  const handlePress = () => {
    if (onProductPress) {
      onProductPress(currentProduct.id);
    } else {
      // Action par défaut
      console.log("Produit sélectionné:", currentProduct.name);
    }
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(currentProduct);
    } else {
      // Action par défaut pour les favoris
      console.log("Favori togglé:", currentProduct.name);
    }
  };

  return (
    <ProductItemPresenter
      name={currentProduct.name}
      category={currentProduct.category?.name || "Construction"}
      price={currentProduct.promotionPrice || currentProduct.priceTtc}
      unit="unité"
      imageSource={getImageSource()}
      inStock={currentProduct.quantity > 0}
      onPress={handlePress}
      isFavorited={currentProduct.isFavorited}
      onFavoritePress={handleFavoritePress}
      promotionPercentage={currentProduct.promotionPercentage}
      isTabletDevice={isTabletDevice}
      imageError={imageError}
      isLoading={isLoading}
      onImageError={handleImageError}
      onImageLoad={handleImageLoad}
    />
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
