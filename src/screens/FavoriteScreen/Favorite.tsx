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
        setError("Erreur lors du chargement des favoris");
        if (page === 1) {
          isRefresh ? setIsRefreshing(true) : setIsLoading(true);
          setError(null);
        } else {
          setIsLoadingMore(true);
        }

        const response = await favoritesService.getFavoritesByUser(user.id, {
          page,
          limit: 10,
        });

        // Handle different response structures
        let favoriteProducts: ProductBasicDto[] = [];

        if (response?.favorites && Array.isArray(response.favorites)) {
          // If response has favorites array with product data
          favoriteProducts = response.favorites.map((fav: any) => ({
            ...fav.product,
            isFavorited: true,
          }));
        } else if (response?.data && Array.isArray(response.data)) {
          // If response has data array
          favoriteProducts = response.data.map((fav: any) => ({
            ...fav.product,
            isFavorited: true,
          }));
        } else if (Array.isArray(response)) {
          // If response is directly an array
          favoriteProducts = response.map((fav: any) => ({
            ...fav.product,
            isFavorited: true,
          }));
        }

        if (page === 1) {
          setFavorites(favoriteProducts);
          setCurrentPage(1);
        } else {
          setFavorites((prev) => [...prev, ...favoriteProducts]);
          setCurrentPage(page);
        }

        // Check if there are more pages
        setHasMorePages(favoriteProducts.length === 10);
      } catch (err: any) {
        console.error("Error fetching favorites:", err);
        if (page === 1) {
          setFavorites([]);
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
    if (!isLoadingMore && hasMorePages && favorites.length > 0) {
      fetchFavorites(currentPage + 1);
    }
  }, [
    fetchFavorites,
    currentPage,
    isLoadingMore,
    hasMorePages,
    favorites.length,
  ]);

  // Refresh favorites
  const handleRefresh = useCallback(() => {
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
