import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProductPresenter from "./ProductPresenter";
import productsService from "../../services/productsService";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

interface ProductProps {
  route: ProductScreenRouteProp;
}

const Product = ({ route }: ProductProps) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const productDetail = await productsService.findOne(productId);
        console.log("Product detail:", productDetail);
        setProduct(productDetail);
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };

    fetchProductDetail();
  }, [productId]);

  return <ProductPresenter product={product} />;
};

export default Product;
