import React, { useEffect, useState } from "react";
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductPresenter from "./ProductPresenter";
import productsService from "../../services/productsService";
import cartsService, { AddProductDto } from "../../services/cartsService";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';
import { ProductDetailDto } from "src/types/Product";
import { useAuth } from 'src/hooks/useAuth';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

interface ProductProps {
  route: ProductScreenRouteProp;
}

const Product = ({ route }: ProductProps) => {
  const { productId } = route.params;
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productsService.findOne(productId);
        setProduct(response.product);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSimilarProductSelect = async (newProductId: number) => {
    try {
      setLoading(true);
      const response = await productsService.findOne(newProductId);
      setProduct(response.product);
      
      // Update the route params to reflect the new product
      navigation.setParams({ productId: newProductId });
    } catch (error) {
      console.log("Error fetching new product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (quantity: number) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!product) {
      Alert.alert('Erreur', 'Produit non disponible');
      return;
    }

    try {
      setAddToCartLoading(true);

      // First get the user's active cart
      const response = await cartsService.getUserActiveCart(user.id);

      const addProductDto: AddProductDto = {
        cartId: response.cart.id,
        productId: product.id,
        quantity: quantity,
      };

      await cartsService.addCartItem(addProductDto);
      
      Alert.alert(
        'Succès', 
        `${quantity} ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert(
        'Erreur', 
        error?.response?.data?.message || 'Impossible d\'ajouter le produit au panier',
        [{ text: 'OK' }]
      );
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <ProductPresenter 
      product={product} 
      loading={loading}
      onBack={handleBack}
      onSimilarProductSelect={handleSimilarProductSelect}
      onAddToCart={handleAddToCart}
      addToCartLoading={addToCartLoading}
      showAuthModal={showAuthModal}
      onCloseAuthModal={handleCloseAuthModal}
    />
  );
};

export default Product;
