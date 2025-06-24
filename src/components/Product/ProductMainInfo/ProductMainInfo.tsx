import React, { useState } from 'react';
import { ProductDetailDto } from 'src/types/Product';
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

  const handleAddToCart = async () => {
    if (onAddToCart) {
      await onAddToCart(quantity);
    } else {
      // Fallback behavior if no onAddToCart prop is provided
      setIsLoading(true);
      try {
        console.log(`Adding ${quantity} of product ${product.id} to cart`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = product.priceTtc;
    // Check if product is in promotion
    const finalPrice = product.isInPromotion && product.promotionPrice 
      ? product.promotionPrice 
      : basePrice;
    return finalPrice * quantity;
  };

  const hasStock = product.quantity > 0;
  const isOutOfStock = !hasStock;
  const isLowStock = product.quantity <= 5 && product.quantity > 0;

  return (
    <ProductMainInfoPresenter
      product={product}
      quantity={quantity}
      isLoading={onAddToCart ? addToCartLoading : isLoading}
      hasStock={hasStock}
      isOutOfStock={isOutOfStock}
      isLowStock={isLowStock}
      totalPrice={calculateTotalPrice()}
      onQuantityChange={handleQuantityChange}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      onAddToCart={handleAddToCart}
    />
  );
};

export default ProductMainInfo; 