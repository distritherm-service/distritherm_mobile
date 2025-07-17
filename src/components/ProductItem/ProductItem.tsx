import { Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ProductItemPresenter from "./ProductItemPresenter";
import { ProductBasicDto } from "src/types/Product";
import { isTablet } from "src/utils/deviceUtils";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { RootStackParamList } from "src/navigation/types";
import { useAuth } from "src/hooks/useAuth";
import favoritesService from "src/services/favoritesService";
import interactionsService from "src/services/interactionsService";
import { calculateProductPricing, hasStockAvailable } from "src/utils/priceUtils";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ProductItemProps {
  product?: ProductBasicDto;
  onPressFavoriteAdd?: () => any;
  onPressFavoriteRemove?: () => any;
  onPressProduct?: () => any;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onPressFavoriteAdd,
  onPressFavoriteRemove,
  onPressProduct,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  // Logique métier
  const isTabletDevice = isTablet();
  // Données d'exemple pour un produit de construction
  const defaultProduct: ProductBasicDto = {
    id: 1,
    name: "Plaque de plâtre BA13 standard",
    priceHt: 7.08, // 8.5 / 1.20 (TTC to HT conversion)
    priceTtc: 8.5,
    quantity: 10,
    imagesUrl: [],
    description: "Plaque de plâtre standard pour cloisons",
    categoryId: 1,
    markId: 1,
    unity: "m²",
    category: {
      id: 1,
      name: "Plâtrerie",
    },
    isInPromotion: false,
    promotionPrice: undefined,
    promotionEndDate: undefined,
    promotionPercentage: undefined,
    isFavorited: false,
    proInfo: null,
  };

  const currentProduct = product || defaultProduct;

  // États pour la gestion de l'image
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // État pour gérer le statut favori localement
  const [isFavorited, setIsFavorited] = useState(currentProduct.isFavorited);

  // Mettre à jour l'état favori local quand le produit change
  useEffect(() => {
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
    if (imageError || !currentProduct.imagesUrl?.[0]) {
      return { uri: NO_IMAGE_URL };
    }
    return { uri: currentProduct.imagesUrl[0] };
  };

  // Calcul des informations de prix et remise basé sur la catégorie du produit
  // La logique ne dépend plus du userState mais de la correspondance entre 
  // product.categoryId et product.proInfo.categoryIdPro
  const pricingInfo = calculateProductPricing(currentProduct);

  // Handlers pour les actions
  const handlePress = async () => {
    if (onPressProduct) onPressProduct();
    
    if (user) {
      try {
        await interactionsService.createInteraction({
          type: 'CLICK_PRODUCT',
          productId: currentProduct.id,
          userId: user.id,
        });
      } catch (error) {
        console.error('Failed to track product interaction:', error);
        // Don't block navigation if interaction tracking fails
      }
    }
    
    navigation.navigate("Product", { productId: currentProduct.id });
  };

  const handleFavoritePress = async () => {
    if (!user) {
      Alert.alert(
        "Vous n'êtes pas authentifié",
        "Veuillez vous authentifier pour mettre un produit en favoris",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Aller à la page de connexion",
            style: "default",
            onPress: () => {
              navigation.navigate("Auth", { screen: "Login" });
            },
          },
        ]
      );
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        setIsFavorited(false);
        if (onPressFavoriteRemove) onPressFavoriteRemove();
        await favoritesService.deleteFavoriteByProduct(currentProduct.id);
      } else {
        setIsFavorited(true);
        if (onPressFavoriteAdd) onPressFavoriteAdd();
        await favoritesService.createFavorite({
          productId: currentProduct.id,
          userId: user.id,
        });
        if (onPressFavoriteAdd) onPressFavoriteAdd();
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  return (
    <ProductItemPresenter
      name={currentProduct.name}
      category={currentProduct.category?.name || "Construction"}
      price={pricingInfo.discountedPriceHt}
      originalPrice={pricingInfo.isApplicable ? pricingInfo.originalPriceHt : undefined}
      unit={currentProduct.unity || "unité"}
      imageSource={getImageSource()}
      inStock={hasStockAvailable(currentProduct)}
      onPress={handlePress}
      isFavorited={isFavorited}
      onFavoritePress={handleFavoritePress}
      discountType={pricingInfo.type}
      discountPercentage={pricingInfo.percentage}
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
