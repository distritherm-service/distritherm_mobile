import React, { useState, useEffect } from 'react';
import productsService from 'src/services/productsService';
import { ProductBasicDto } from 'src/types/Product';
import ProductSimilarPresenter from './ProductSimilarPresenter';

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

        setError('Erreur lors du chargement des produits similaires');
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProductId, categoryId, markId]);



  return (
    <ProductSimilarPresenter
      similarProducts={similarProducts}
      loading={loading}
      error={error}
      onRetry={() => {
        setError(null);
        // Trigger useEffect again by updating a dependency
        setLoading(true);
      }}
    />
  );
};

export default ProductSimilar; 