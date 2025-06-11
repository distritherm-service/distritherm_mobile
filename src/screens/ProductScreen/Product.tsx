import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import ProductPresenter from "./ProductPresenter";
import productsService from "../../services/productsService";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

interface ProductProps {
  route: ProductScreenRouteProp;
}

export interface ProductData {
  id: number;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  brand?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
}

const Product = ({ route }: ProductProps) => {
  const { productId } = route.params;
  const navigation = useNavigation();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const productDetail = await productsService.findOne(productId);
        console.log("Product detail:", productDetail);
        setProduct(productDetail);
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

  return (
    <ProductPresenter 
      product={product} 
      loading={loading}
      onBack={handleBack}
    />
  );
};

export default Product;
