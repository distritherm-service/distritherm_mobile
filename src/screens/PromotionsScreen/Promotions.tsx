import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import promotionsService, { PromotionDto, PromotionFiltersDto } from "src/services/promotionsService";
import categoriesService from "src/services/categoriesService";
import { RootStackParamList } from "src/navigation/types";
import { ProductBasicDto } from "src/types/Product";
import { Category } from "src/types/Category";
import PromotionsPresenter from "./PromotionsPresenter";

type PromotionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Promotions: React.FC = () => {
  const navigation = useNavigation<PromotionsScreenNavigationProp>();

  // State management
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [products, setProducts] = useState<ProductBasicDto[]>([]);
  const [promotionsCount, setPromotionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  
  // Category filter state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  const ITEMS_PER_PAGE = 10;

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await categoriesService.getAllCategories();
      
      if (response && response.categories) {
        setCategories(response.categories);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      // Categories loading error doesn't block the main functionality
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  // Fetch promotions function
  const fetchPromotions = useCallback(async (page: number = 1, isRefresh: boolean = false, categoryId: number | null = selectedCategoryId) => {
    try {
      // Clear error and set loading states
      setError(null);
      
      if (page === 1) {
        isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const filters: PromotionFiltersDto = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      
      if (categoryId) {
        filters.categoryId = categoryId;
      }

      const response = await promotionsService.findAll(filters);

      if (response && response.promotions) {
        const newPromotions = response.promotions;
        const meta = response.meta;

        // Extract and enrich products from promotions
        const newProducts = newPromotions
          .filter(promotion => promotion.product)
          .map(promotion => {
            const product = promotion.product!;
            return {
              ...product,
              isInPromotion: true,
              promotionPrice: promotion.promotionPrice || (product.priceTtc * (1 - promotion.reductionPercentage / 100)),
              promotionEndDate: new Date(promotion.endDate),
              promotionPercentage: promotion.reductionPercentage,
            };
          });

        if (page === 1) {
          setPromotions(newPromotions);
          setProducts(newProducts);
        } else {
          setPromotions(prev => [...prev, ...newPromotions]);
          setProducts(prev => [...prev, ...newProducts]);
        }

        setPromotionsCount(meta.total);
        setCurrentPage(page);
        setHasMorePages(page < meta.lastPage); // Fix: use lastPage instead of total
      }
    } catch (err: any) {
      console.error("Error fetching promotions:", err);
      
      // Set appropriate error message
      const errorMessage = err?.response?.data?.message || 
                         err?.message || 
                         "Erreur lors du chargement des promotions";
      setError(errorMessage);
      
      // Reset data only on first page error
      if (page === 1) {
        setPromotions([]);
        setProducts([]);
        setHasMorePages(false);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [selectedCategoryId]);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchPromotions(1);
  }, [fetchCategories, fetchPromotions]);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    setHasMorePages(true);
    setError(null);
    fetchPromotions(1, false, categoryId);
  }, [fetchPromotions]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    setError(null);
    fetchPromotions(1, true);
  }, [fetchPromotions]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && 
        !isLoading && 
        !isRefreshing && 
        hasMorePages && 
        products.length > 0 && 
        !error) {
      fetchPromotions(currentPage + 1);
    }
  }, [isLoadingMore, isLoading, isRefreshing, hasMorePages, products.length, error, currentPage, fetchPromotions]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentPage(1);
    setHasMorePages(true);
    fetchPromotions(1);
  }, [fetchPromotions]);

  // Navigation handlers
  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);



  return (
    <PromotionsPresenter
      promotions={promotions}
      products={products}
      promotionsCount={promotionsCount}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      isLoadingMore={isLoadingMore}
      hasMorePages={hasMorePages}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isCategoriesLoading={isCategoriesLoading}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onRetry={handleRetry}
      onNavigateBack={handleNavigateBack}
      onCategorySelect={handleCategorySelect}
    />
  );
};

export default Promotions; 