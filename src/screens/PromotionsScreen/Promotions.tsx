import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import promotionsService, { PromotionDto } from "src/services/promotionsService";
import { RootStackParamList } from "src/navigation/types";
import PromotionsPresenter from "./PromotionsPresenter";

type PromotionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Promotions: React.FC = () => {
  const navigation = useNavigation<PromotionsScreenNavigationProp>();

  // State management
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [promotionsCount, setPromotionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);

  const ITEMS_PER_PAGE = 10;

  // Fetch promotions function
  const fetchPromotions = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);

      const response = await promotionsService.findAll({
        page,
        limit: ITEMS_PER_PAGE,
      });

      if (response && response.data) {
        const newPromotions = response.data;
        const meta = response.meta;

        if (page === 1) {
          setPromotions(newPromotions);
        } else {
          setPromotions(prev => [...prev, ...newPromotions]);
        }

        setPromotionsCount(meta.total);
        setCurrentPage(page);
        setHasMorePages(page < meta.lastPage);
      }
    } catch (err: any) {
      console.error("Error fetching promotions:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des promotions");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPromotions(1);
  }, [fetchPromotions]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    fetchPromotions(1, true);
  }, [fetchPromotions]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMorePages && !isLoading) {
      fetchPromotions(currentPage + 1);
    }
  }, [isLoadingMore, hasMorePages, isLoading, currentPage, fetchPromotions]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    fetchPromotions(1);
  }, [fetchPromotions]);

  // Navigation handlers
  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToProduct = useCallback((productId: number) => {
    navigation.navigate("Product", { productId });
  }, [navigation]);

  return (
    <PromotionsPresenter
      promotions={promotions}
      promotionsCount={promotionsCount}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      isLoadingMore={isLoadingMore}
      hasMorePages={hasMorePages}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onRetry={handleRetry}
      onNavigateBack={handleNavigateBack}
      onNavigateToProduct={handleNavigateToProduct}
    />
  );
};

export default Promotions; 