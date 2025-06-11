import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import ProductPresenter from "./ProductPresenter";
import productsService from "../../services/productsService";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';
import { ProductDetailDto } from "src/types/Product";

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

interface ProductProps {
  route: ProductScreenRouteProp;
}

const Product = ({ route }: ProductProps) => {
  const { productId } = route.params;
  const navigation = useNavigation();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <ProductPresenter 
      product={product} 
      loading={loading}
      onBack={handleBack}
      onSimilarProductSelect={handleSimilarProductSelect}
    />
  );
};

export default Product;
