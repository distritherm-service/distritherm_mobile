import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ProductItemPresenter from "./ProductItemPresenter";
import { ProductBasicDto } from "src/types/Product";
import { isTablet } from "src/utils/deviceUtils";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { RootStackParamList } from "src/navigation/types";
import { useAuth } from "src/hooks/useAuth";
import favoritesService from "src/services/favoritesService";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ProductItemProps {
  product?: ProductBasicDto;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  
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

  // États pour la gestion de l'image
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  // État pour gérer le statut favori localement
  const [isFavorited, setIsFavorited] = useState(currentProduct.isFavorited);
  
  // Mettre à jour l'état favori local quand le produit change
  React.useEffect(() => {
    setIsFavorited(currentProduct.isFavorited);
  }, [currentProduct.isFavorited]);

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
    // Navigate to Product screen with productId
    navigation.navigate('Product', { productId: currentProduct.id });
  };

  const handleFavoritePress = async () => {
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    try {
      setIsFavoriteLoading(true);
      
      if (isFavorited) {
        // Remove from favorites
        await favoritesService.deleteFavoriteByProduct(currentProduct.id);
        console.log("Produit retiré des favoris:", currentProduct.name);
        setIsFavorited(false);
      } else {
        // Add to favorites
        await favoritesService.createFavorite({
          productId: currentProduct.id,
          userId: user.id,
        });
        console.log("Produit ajouté aux favoris:", currentProduct.name);
        setIsFavorited(true);
      }
      
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
    } finally {
      setIsFavoriteLoading(false);
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
      isFavorited={isFavorited}
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
