import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProductItemPresenter from './ProductItemPresenter'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
}

interface ProductItemProps {
  product?: Product;
  onProductPress?: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  product, 
  onProductPress 
}) => {
  // Données d'exemple pour un produit de construction
  const defaultProduct: Product = {
    id: '1',
    name: 'Plaque de plâtre BA13 standard',
    category: 'Plâtrerie',
    price: 8.50,
    unit: 'm²',
    imageUrl: undefined, // Pas d'image pour l'exemple
    inStock: true,
  };

  const currentProduct = product || defaultProduct;

  const handlePress = () => {
    if (onProductPress) {
      onProductPress(currentProduct);
    } else {
      // Action par défaut
      console.log('Produit sélectionné:', currentProduct.name);
    }
  };

  return (
    <ProductItemPresenter
      name={currentProduct.name}
      category={currentProduct.category}
      price={currentProduct.price}
      unit={currentProduct.unit}
      imageUrl={currentProduct.imageUrl}
      inStock={currentProduct.inStock}
      onPress={handlePress}
    />
  );
};

export default ProductItem

const styles = StyleSheet.create({})