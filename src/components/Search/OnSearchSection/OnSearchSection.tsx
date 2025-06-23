import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import OnSearchSectionPresenter from "./OnSearchSectionPresenter";
import productsService, { SearchFilters } from "src/services/productsService";
import { ProductBasicDto } from "src/types/Product";
import { SearchFilter } from "src/navigation/types";
import categoriesService from "src/services/categoriesService";
import marksService from "src/services/marksService";
import interactionsService from "src/services/interactionsService";
import { useAuth } from "src/hooks/useAuth";

interface Category {
  id: number;
  name: string;
}

interface Mark {
  id: number;
  name: string;
}

interface OnSearchSectionProps {
  searchQuery: string;
  filter: SearchFilter;
  onBackToTyping: () => void;
  onFilterChange: (filter: SearchFilter) => void;
}

/**
 * Container component for OnSearchSection
 * Handles search results logic and API calls
 */
const OnSearchSection: React.FC<OnSearchSectionProps> = ({
  searchQuery,
  filter,
  onBackToTyping,
  onFilterChange,
}) => {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState<ProductBasicDto[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Pre-loaded filter data
  const [categories, setCategories] = useState<Category[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [isLoadingFilterData, setIsLoadingFilterData] = useState(false);

  const { user } = useAuth();

  /**
   * Pre-load categories and marks data
   */
  const loadFilterData = useCallback(async () => {
    setIsLoadingFilterData(true);
    await Promise.all([loadCategories(), loadMarks()]);
    setIsLoadingFilterData(false);
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await categoriesService.getAllCategories();

      if (response?.categories && Array.isArray(response.categories)) {
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        // Add test data as fallback
        setCategories([
          { id: 1, name: "Électronique" },
          { id: 2, name: "Vêtements" },
          { id: 3, name: "Maison & Jardin" },
          { id: 4, name: "Sports & Loisirs" },
          { id: 5, name: "Beauté & Santé" },
        ]);
      }
    } catch (error: any) {
      // Add test data on error
      setCategories([
        { id: 1, name: "Électronique" },
        { id: 2, name: "Vêtements" },
        { id: 3, name: "Maison & Jardin" },
        { id: 4, name: "Sports & Loisirs" },
        { id: 5, name: "Beauté & Santé" },
      ]);
    }
  }, []);

  const loadMarks = useCallback(async () => {
    try {
      const response = await marksService.findAll();

      if (response?.marks && Array.isArray(response.marks)) {
        setMarks(response.marks);
      } else if (Array.isArray(response)) {
        setMarks(response);
      } else {
        // Add test data as fallback
        setMarks([
          { id: 1, name: "Samsung" },
          { id: 2, name: "Apple" },
          { id: 3, name: "Nike" },
          { id: 4, name: "Adidas" },
          { id: 5, name: "Sony" },
        ]);
      }
    } catch (error: any) {
      // Add test data on error
      setMarks([
        { id: 1, name: "Samsung" },
        { id: 2, name: "Apple" },
        { id: 3, name: "Nike" },
        { id: 4, name: "Adidas" },
        { id: 5, name: "Sony" },
      ]);
    }
  }, []);

  // Pre-load filter data when component mounts
  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  // Perform search when component mounts or search parameters change
  useEffect(() => {
    // Check if we have any search criteria (query or filters)
    const hasQuery = searchQuery.trim();
    const hasFilters =
      filter.categoryId ||
      filter.markId ||
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined ||
      filter.inPromotion;

    if (hasQuery || hasFilters) {
      performSearch();
    }
  }, [searchQuery, filter]);

  /**
   * Perform search with current query and filters
   */
  const performSearch = useCallback(async () => {
    // Check if we have any search criteria (query or filters)
    const hasQuery = searchQuery.trim();
    const hasFilters =
      filter.categoryId ||
      filter.markId ||
      filter.minPrice ||
      filter.maxPrice ||
      filter.inPromotion;

    // If no query and no filters, clear results
    if (!hasQuery && !hasFilters) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoadingResults(true);
    setResultsError(null);
    setHasSearched(true);

    try {
      let response;

      // Use advanced search when we have filters OR when we have both query and filters
      // Use simple search only when we have query without any filters
      if (hasFilters) {
        // Use advanced search when we have filters
        const searchFilters: SearchFilters = {};

        if (hasQuery) {
          searchFilters.query = searchQuery.trim();
        }

        if (filter.categoryId) {
          searchFilters.categoryId = filter.categoryId;
        }

        if (filter.markId) {
          searchFilters.markId = filter.markId;
        }

        if (filter.minPrice !== undefined) {
          searchFilters.minPrice = filter.minPrice;
        }

        if (filter.maxPrice !== undefined) {
          searchFilters.maxPrice = filter.maxPrice;
        }

        if (filter.inPromotion) {
          searchFilters.inPromotion = filter.inPromotion;
        }

        response = await productsService.searchWithFilters(searchFilters, {
          page: 1,
          limit: 20,
        });
      } else if (hasQuery) {
        // Use simple search when we only have a query (no filters)
        response = await productsService.search(searchQuery.trim(), {
          page: 1,
          limit: 20,
        });
      }

      // Handle response
      if (response && response.products && Array.isArray(response.products)) {
        setSearchResults(response.products);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Handle different response formats
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setResultsError("Erreur lors de la recherche");
      setSearchResults([]);

      // Fallback to category-specific search if we have a categoryId but no query
      if (filter.categoryId && !hasQuery) {
        try {
          const categoryResponse = await productsService.getProductsByCategory(
            filter.categoryId,
            { page: 1, limit: 20 }
          );
          if (
            categoryResponse &&
            categoryResponse.products &&
            Array.isArray(categoryResponse.products)
          ) {
            setSearchResults(categoryResponse.products);
            setResultsError(null);
          } else if (
            categoryResponse &&
            categoryResponse.data &&
            Array.isArray(categoryResponse.data)
          ) {
            setSearchResults(categoryResponse.data);
            setResultsError(null);
          }
        } catch (fallbackError) {
          // Silent fallback error handling
        }
      }
    } finally {
      setIsLoadingResults(false);
    }
  }, [searchQuery, filter]);

  /**
   * Handle retry search
   */
  const handleRetrySearch = useCallback(() => {
    performSearch();
  }, [performSearch]);

  /**
   * Handle clear search
   */
  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    setHasSearched(false);
    setResultsError(null);
    onBackToTyping();
  }, [onBackToTyping]);

  /**
   * Handle filter modal toggle
   */
  const handleFilterPress = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  /**
   * Handle filter modal close
   */
  const handleFilterModalClose = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  /**
   * Handle apply filter with immediate feedback
   */
  const handleApplyFilter = useCallback(
    (newFilter: SearchFilter) => {
      setIsLoadingResults(true);
      onFilterChange(newFilter);
      setIsFilterModalOpen(false);
    },
    [onFilterChange]
  );

  /**
   * Handle clearing individual filters immediately
   */
  const handleClearIndividualFilter = useCallback(
    (filterType: 'category' | 'mark' | 'price' | 'promotion') => {
      const newFilter = { ...filter };
      
      switch (filterType) {
        case 'category':
          delete newFilter.categoryId;
          delete newFilter.categoryName;
          break;
        case 'mark':
          delete newFilter.markId;
          delete newFilter.markName;
          break;
        case 'price':
          delete newFilter.minPrice;
          delete newFilter.maxPrice;
          break;
        case 'promotion':
          delete newFilter.inPromotion;
          break;
      }
      
      onFilterChange(newFilter);
    },
    [filter, onFilterChange]
  );

  /**
   * Handle clearing all filters immediately
   */
  const handleClearAllFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  /**
   * Handle product press from search results - track SEARCH_PRODUCT interaction
   */
  const handleProductPress = useCallback(async (productId: number) => {
    // Track interaction if user is connected
    if (user) {
      try {
        await interactionsService.createInteraction({
          type: 'SEARCH_PRODUCT',
          productId: productId,
          userId: user.id,
        });
      } catch (error) {
        console.error('Failed to track search product interaction:', error);
        // Don't block the interaction if tracking fails
      }
    }
  }, [user]);

  return (
    <OnSearchSectionPresenter
      searchQuery={searchQuery}
      filter={filter}
      searchResults={searchResults}
      isLoadingResults={isLoadingResults}
      resultsError={resultsError}
      hasSearched={hasSearched}
      isFilterModalOpen={isFilterModalOpen}
      // Pre-loaded filter data
      categories={categories}
      marks={marks}
      isLoadingFilterData={isLoadingFilterData}

      onRetrySearch={handleRetrySearch}
      onClearSearch={handleClearSearch}
      onBackToTyping={onBackToTyping}
      onFilterPress={handleFilterPress}
      onFilterModalClose={handleFilterModalClose}
      onApplyFilter={handleApplyFilter}
      onClearIndividualFilter={handleClearIndividualFilter}
      onClearAllFilters={handleClearAllFilters}
      onProductPress={handleProductPress}
    />
  );
};

export default OnSearchSection;
