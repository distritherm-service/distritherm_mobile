import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import promotionsService, { PromotionDto, PromotionFiltersDto } from "src/services/promotionsService";
import categoriesService from "src/services/categoriesService";
import { RootStackParamList } from "src/navigation/types";
import { ProductBasicDto } from "src/types/Product";
import { Category } from "src/types/Category";
import { SelectOption } from "src/components/Input/Input";
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
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<SelectOption | undefined>(undefined);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  const ITEMS_PER_PAGE = 10;

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await categoriesService.getAllCategories();
      
      if (response && response.categories) {
        setCategories(response.categories);
        
        // Create category options for the select input
        const allOption: SelectOption = {
          label: "Toutes les catégories",
          value: "all",
        };
        
        const categorySelectOptions: SelectOption[] = response.categories.map((category: Category) => ({
          label: category.name,
          value: category.id.toString(),
        }));
        
        setCategoryOptions([allOption, ...categorySelectOptions]);
        setSelectedCategoryOption(allOption); // Default to "All categories"
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      // Set default "All categories" option even if categories fail to load
      const allOption: SelectOption = {
        label: "Toutes les catégories",
        value: "all",
      };
      setCategoryOptions([allOption]);
      setSelectedCategoryOption(allOption);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  // Fetch promotions function - removed selectedCategoryId dependency to prevent stale closures
  const fetchPromotions = useCallback(async (page: number = 1, isRefresh: boolean = false, categoryId?: number | null) => {
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
      
      // Use the passed categoryId parameter or current selectedCategoryId
      const currentCategoryId = categoryId !== undefined ? categoryId : selectedCategoryId;
      if (currentCategoryId && currentCategoryId > 0) {
        filters.categoryId = currentCategoryId;
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
        setHasMorePages(page < meta.lastPage);
      } else {
        // Handle case where response is successful but no promotions
        if (page === 1) {
          setPromotions([]);
          setProducts([]);
          setPromotionsCount(0);
        }
        setHasMorePages(false);
      }
    } catch (err: any) {
      console.error("Error fetching promotions:", err);
      
      // Handle different types of errors more gracefully
      let errorMessage = "Erreur lors du chargement des promotions";
      
      if (err?.response?.status === 404) {
        // 404 means no promotions found for this category - not really an error
        if (page === 1) {
          setPromotions([]);
          setProducts([]);
          setPromotionsCount(0);
        }
        setHasMorePages(false);
        setError(null); // Don't show error for empty results
      } else if (err?.response?.status === 500) {
        // Server error - could be temporary
        errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
        setError(errorMessage);
      } else if (err?.response?.status >= 400 && err?.response?.status < 500) {
        // Client error
        errorMessage = err?.response?.data?.message || "Erreur de requête";
        setError(errorMessage);
      } else if (err?.code === 'NETWORK_ERROR' || !err?.response) {
        // Network error
        errorMessage = "Erreur de connexion. Vérifiez votre connexion internet.";
        setError(errorMessage);
      } else {
        // Other errors
        errorMessage = err?.response?.data?.message || err?.message || errorMessage;
        setError(errorMessage);
      }
      
      // Reset data only on first page error (and only if it's a real error, not empty results)
      if (page === 1 && err?.response?.status !== 404) {
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

  // Initial load - only fetch categories and initial promotions once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch initial promotions after categories are loaded
  useEffect(() => {
    if (!isCategoriesLoading && categoryOptions.length > 0) {
      fetchPromotions(1, false, null);
    }
  }, [isCategoriesLoading, categoryOptions.length]);

  // Handle category selection
  const handleCategorySelect = useCallback((option: SelectOption) => {
    const categoryId = option.value === "all" ? null : parseInt(option.value) || null;
    
    setSelectedCategoryId(categoryId);
    setSelectedCategoryOption(option);
    setCurrentPage(1);
    setHasMorePages(true);
    setError(null);
    
    // Clear current data before fetching new data
    setPromotions([]);
    setProducts([]);
    setPromotionsCount(0);
    
    // Fetch promotions with the new category filter
    fetchPromotions(1, false, categoryId);
  }, [fetchPromotions]);

  // Handle refresh - use current selected category
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    setError(null);
    fetchPromotions(1, true, selectedCategoryId);
  }, [fetchPromotions, selectedCategoryId]);

  // Handle load more - use current selected category
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && 
        !isLoading && 
        !isRefreshing && 
        hasMorePages && 
        products.length > 0 && 
        !error) {
      fetchPromotions(currentPage + 1, false, selectedCategoryId);
    }
  }, [isLoadingMore, isLoading, isRefreshing, hasMorePages, products.length, error, currentPage, fetchPromotions, selectedCategoryId]);

  // Handle retry - use current selected category
  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentPage(1);
    setHasMorePages(true);
    fetchPromotions(1, false, selectedCategoryId);
  }, [fetchPromotions, selectedCategoryId]);

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
      selectedCategoryOption={selectedCategoryOption}
      categoryOptions={categoryOptions}
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