import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RefreshControl } from "react-native";
import { useAuth } from "src/hooks/useAuth";
import favoritesService from "src/services/favoritesService";
import { ProductBasicDto } from "src/types/Product";
import { RootStackParamList } from "src/navigation/types";
import FavoritePresenter from "./FavoritePresenter";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Favorite = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isAuthenticated, user } = useAuth();

  // States
  const [favorites, setFavorites] = useState<ProductBasicDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Fetch favorites function
  const fetchFavorites = useCallback(
    async (page: number = 1, isRefresh: boolean = false) => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Clear error and set loading states
        setError(null);
        if (page === 1) {
          isRefresh ? setIsRefreshing(true) : setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await favoritesService.getFavoritesByUser(user.id, {
          page,
          limit: 10,
        });

        // Handle different response structures
        let favoriteProducts: ProductBasicDto[] = [];
        let totalCount = 0;
        let hasMore = false;

        if (response?.favorites && Array.isArray(response.favorites)) {
          // If response has favorites array with product data
          favoriteProducts = response.favorites
            .filter((fav: any) => fav?.product)
            .map((fav: any) => ({
              ...fav.product,
              isFavorited: true,
            }));

          // Handle meta data if available
          if (response.meta) {
            totalCount = response.meta.total || 0;
            hasMore = page < (response.meta.total || 1);
          } else {
            hasMore = favoriteProducts.length === 10;
          }
        } else if (Array.isArray(response)) {
          favoriteProducts = response
            .filter((fav: any) => fav?.product)
            .map((fav: any) => ({
              ...fav.product,
              isFavorited: true,
            }));
          hasMore = favoriteProducts.length === 10;
        } else {
          // Handle unexpected response format
          console.warn("Unexpected response format:", response);
          favoriteProducts = [];
          hasMore = false;
        }

        if (page === 1) {
          setFavorites(favoriteProducts);
          setCurrentPage(1);
        } else {
          setFavorites((prev) => [...prev, ...favoriteProducts]);
          setCurrentPage(page);
        }

        // Update pagination state
        setHasMorePages(hasMore);
      } catch (err: any) {
        console.error("Error fetching favorites:", err);

        // Set appropriate error message
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Erreur lors du chargement des favoris";
        setError(errorMessage);

        // Reset data only on first page error
        if (page === 1) {
          setFavorites([]);
          setHasMorePages(false);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [isAuthenticated, user]
  );

  // Load more favorites
  const loadMoreFavorites = useCallback(() => {
    if (
      !isLoadingMore &&
      !isLoading &&
      !isRefreshing &&
      hasMorePages &&
      favorites.length > 0 &&
      !error &&
      isAuthenticated &&
      user
    ) {
      fetchFavorites(currentPage + 1);
    }
  }, [
    fetchFavorites,
    currentPage,
    isLoadingMore,
    isLoading,
    isRefreshing,
    hasMorePages,
    favorites.length,
    error,
    isAuthenticated,
    user,
  ]);

  // Refresh favorites
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    setError(null);
    fetchFavorites(1, true);
  }, [fetchFavorites]);

  // Remove favorite
  const handleRemoveFavorite = useCallback(
    async (productId: number) => {
      if (!user) return;

      try {
        // Update local state
        console.log(productId);
        setFavorites((prev) =>
          prev.filter((product) => product.id !== productId)
        );
        // You could add a toast notification here
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    },
    [user]
  );

  // Navigate to login
  const handleNavigateToLogin = useCallback(() => {
    navigation.navigate("Auth", { screen: "Login" });
  }, [navigation]);

  // Retry loading favorites
  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentPage(1);
    setHasMorePages(true);
    fetchFavorites(1);
  }, [fetchFavorites]);

  // Fetch favorites on component mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavorites(1);
    }, [fetchFavorites])
  );

  return (
    <FavoritePresenter
      isAuthenticated={isAuthenticated}
      favorites={favorites}
      favoritesCount={favorites.length}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      isLoadingMore={isLoadingMore}
      hasMorePages={hasMorePages}
      onRefresh={handleRefresh}
      onLoadMore={loadMoreFavorites}
      onRemoveFavorite={handleRemoveFavorite}
      onNavigateToLogin={handleNavigateToLogin}
      onRetry={handleRetry}
    />
  );
};

export default Favorite;
