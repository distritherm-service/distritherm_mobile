import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import productsService from 'src/services/productsService';
import { ProductBasicDto } from 'src/types/Product';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/types';
import ProductSimilarPresenter from './ProductSimilarPresenter';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ProductSimilarProps {
  currentProductId: number;
  categoryId?: number;
  markId?: number;
  onProductSelect?: (productId: number) => void;
}

const ProductSimilar: React.FC<ProductSimilarProps> = ({ 
  currentProductId, 
  categoryId, 
  markId,
  onProductSelect 
}) => {
  const [similarProducts, setSimilarProducts] = useState<ProductBasicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get similar products using the API (backend handles fallback)
        const response = await productsService.getSimilarProducts(currentProductId);
        
        if (response.products && response.products.length > 0) {
          setSimilarProducts(response.products);
        } else {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.log('Error fetching similar products:', error);
        setError('Erreur lors du chargement des produits similaires');
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProductId, categoryId, markId]);

  const handleSeeAllPress = () => {
    if (categoryId) {
      // Navigate to category screen or products list with category filter
      // You might need to implement this navigation based on your app structure
      console.log('Navigate to category:', categoryId);
    }
  };

  return (
    <ProductSimilarPresenter
      similarProducts={similarProducts}
      loading={loading}
      error={error}
      onSeeAllPress={handleSeeAllPress}
      onRetry={() => {
        setError(null);
        // Trigger useEffect again by updating a dependency
        setLoading(true);
      }}
    />
  );
};

export default ProductSimilar; 