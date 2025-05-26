import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import RecommandationPresenter from "./RecommandationPresenter";
import productsService from "src/services/productsService";
import { ProductBasicDto } from "src/services/productsService";

const Recommandation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<ProductBasicDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsService.getRecommendedProducts();
        setRecommendedProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recommended products:", err);
        setError("Failed to load recommendations");
        setRecommendedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <RecommandationPresenter 
      products={recommendedProducts}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Recommandation;

const styles = StyleSheet.create({});
