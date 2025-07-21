import React, { useState } from 'react';
import { ProductDetailDto } from 'src/types/Product';
import { useAuth } from 'src/hooks/useAuth';
import { calculateProductPricing, calculateTotalPrice, hasStockAvailable, isLowStock } from 'src/utils/priceUtils';
import ProductMainInfoPresenter from './ProductMainInfoPresenter';

interface ProductMainInfoProps {
  product: ProductDetailDto;
  onAddToCart?: (quantity: number) => Promise<void>;
  addToCartLoading?: boolean;
}

const ProductMainInfo: React.FC<ProductMainInfoProps> = ({ 
  product, 
  onAddToCart,
  addToCartLoading = false 
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingQuantity, setIsEditingQuantity] = useState<boolean>(false);
  const [tempQuantityText, setTempQuantityText] = useState<string>('1');
  const { user } = useAuth();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityTextPress = () => {
    setIsEditingQuantity(true);
    setTempQuantityText(quantity.toString());
  };

  const handleQuantityTextChange = (text: string) => {
    setTempQuantityText(text);
  };

  const handleQuantityTextSubmit = () => {
    const newQuantity = parseInt(tempQuantityText, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    } else {
      // Reset to current quantity if invalid
      setTempQuantityText(quantity.toString());
    }
    setIsEditingQuantity(false);
  };

  const handleQuantityTextBlur = () => {
    handleQuantityTextSubmit();
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      await onAddToCart(quantity);
    } else {
      // Fallback behavior if no onAddToCart prop is provided
      setIsLoading(true);
      try {

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Calcul des informations de prix et remise basé sur la catégorie du produit
  // La logique ne dépend plus du userState mais de product.categoryId vs product.proInfo.categoryIdPro
  const pricingInfo = calculateProductPricing(product);

  const calculateProductTotalPrice = () => {
    return calculateTotalPrice(pricingInfo.discountedPriceHt, quantity);
  };

  const hasStock = hasStockAvailable(product);
  const isOutOfStock = !hasStock;
  const isProductLowStock = isLowStock(product);

  return (
    <ProductMainInfoPresenter
      product={product}
      quantity={quantity}
      isLoading={onAddToCart ? addToCartLoading : isLoading}
      hasStock={hasStock}
      isOutOfStock={isOutOfStock}
      isLowStock={isProductLowStock}
      totalPrice={calculateProductTotalPrice()}
      discountInfo={pricingInfo}
      onQuantityChange={handleQuantityChange}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      onAddToCart={handleAddToCart}
      isEditingQuantity={isEditingQuantity}
      tempQuantityText={tempQuantityText}
      onQuantityTextPress={handleQuantityTextPress}
      onQuantityTextChange={handleQuantityTextChange}
      onQuantityTextSubmit={handleQuantityTextSubmit}
      onQuantityTextBlur={handleQuantityTextBlur}
    />
  );
};

export default ProductMainInfo; 