import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import RecommandationPresenter from "./RecommandationPresenter";
import ProductItemSkeleton from "src/components/ProductItem/ProductItemSkeleton/ProductItemSkeleton";
import productsService from "src/services/productsService";
import { ProductBasicDto } from "src/types/Product";
import { useNavigation } from "@react-navigation/native";

const Recommandation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<
    ProductBasicDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const productContainerRef = useRef<View>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingMiddle = useRef(false);
  const consecutiveEmptyResponses = useRef(0);

  const MAX_CONSECUTIVE_EMPTY_RESPONSES = 3;

  const navigation = useNavigation();

  // Logique de génération des skeletons
  const generateInitialSkeletons = useCallback(() => {
    return Array.from({ length: 6 }, (_, index) => (
      <View key={`skeleton-${index}`} style={styles.productWrapper}>
        <ProductItemSkeleton animationDelay={index * 100} />
      </View>
    ));
  }, []);

  const generateLoadMoreSkeletons = useCallback(() => {
    return Array.from({ length: 2 }, (_, index) => (
      <View key={`skeleton-more-${index}`} style={styles.productWrapper}>
        <ProductItemSkeleton animationDelay={index * 150} />
      </View>
    ));
  }, []);

  // Fonction pour nettoyer l'interval
  const clearMiddleCheckInterval = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
      isCheckingMiddle.current = false;
    }
  }, []);

  // Vérifier si tous les produits sont chargés ou s'il n'y en a plus
  const areAllProductsLoaded = useCallback(() => {
    const reachedTotal =
      recommendedProducts.length >= totalProducts && totalProducts > 0;
    const noMore = noMoreProducts;
    const result = reachedTotal || noMore;

    return result;
  }, [recommendedProducts.length, totalProducts, noMoreProducts]);

  // Effet séparé pour démarrer la surveillance après le chargement
  useEffect(() => {
    if (!isLoading && !isLoadingMore && !areAllProductsLoaded()) {
      // Petit délai pour s'assurer que le layout est prêt
      const timer = setTimeout(() => {
        startMiddleCheck();
      }, 250);

      return () => clearTimeout(timer);
    } else if (areAllProductsLoaded()) {
      clearMiddleCheckInterval();
    }
  }, [
    isLoading,
    isLoadingMore,
    recommendedProducts.length,
    totalProducts,
    noMoreProducts,
  ]);

  const fetchRecommendedProducts = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      try {
        if (page === 1) {
          setIsLoading(true);
          setNoMoreProducts(false);
          consecutiveEmptyResponses.current = 0;
          // Get total product count on initial load
          const countResponse = await productsService.count();
          setTotalProducts(countResponse.count);
        } else {
          setIsLoadingMore(true);
        }

        // Vérifier si on a déjà tous les produits ou s'il n'y en a plus
        if (
          (!reset &&
            recommendedProducts.length >= totalProducts &&
            totalProducts > 0) ||
          noMoreProducts
        ) {
          setIsLoading(false);
          setIsLoadingMore(false);
          clearMiddleCheckInterval();
          return;
        }

        const excludedIds = reset
          ? []
          : recommendedProducts.map((product) => product.id);
        const response = await productsService.getRecommendedProducts(
          excludedIds,
          { page, limit: 10 }
        );

        // Vérifier si on a reçu des produits
        if (response.products.length === 0) {
          consecutiveEmptyResponses.current += 1;

          if (
            consecutiveEmptyResponses.current >= MAX_CONSECUTIVE_EMPTY_RESPONSES
          ) {
            setNoMoreProducts(true);
            clearMiddleCheckInterval();
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
          }
        } else {
          // Reset le compteur si on reçoit des produits
          consecutiveEmptyResponses.current = 0;
        }

        if (reset || page === 1) {
          console.log(response.products);
          setRecommendedProducts(response.products);
        } else {
          setRecommendedProducts((prev) => {
            const newProducts = [...prev, ...response.products];
            return newProducts;
          });
        }

        setCurrentPage(page);
        setError(null);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des produits:", err);
        setError("Failed to load recommendations");
        if (page === 1) {
          setRecommendedProducts([]);
        }

        // En cas d'erreur, on considère qu'il n'y a plus de produits après plusieurs tentatives
        consecutiveEmptyResponses.current += 1;
        if (
          consecutiveEmptyResponses.current >= MAX_CONSECUTIVE_EMPTY_RESPONSES
        ) {
          setNoMoreProducts(true);
          clearMiddleCheckInterval();
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [
      recommendedProducts,
      totalProducts,
      noMoreProducts,
      clearMiddleCheckInterval,
    ]
  );



  const loadMoreProducts = useCallback(() => {
    const allLoaded = areAllProductsLoaded();

    if (
      !isLoadingMore &&
      !allLoaded &&
      recommendedProducts.length < totalProducts &&
      !noMoreProducts
    ) {
      clearMiddleCheckInterval();
      fetchRecommendedProducts(currentPage + 1);
    } else {
      clearMiddleCheckInterval();
    }
  }, [
    currentPage,
    isLoadingMore,
    fetchRecommendedProducts,
    recommendedProducts.length,
    totalProducts,
    clearMiddleCheckInterval,
    areAllProductsLoaded,
    noMoreProducts,
  ]);

  const handleContainerLayout = useCallback(() => {
    if (
      productContainerRef.current &&
      !areAllProductsLoaded() &&
      !isLoadingMore &&
      !isCheckingMiddle.current
    ) {
      // Démarrer la surveillance avec un petit délai
      setTimeout(() => {
        startMiddleCheck();
      }, 250);
    }
  }, [isLoadingMore, areAllProductsLoaded]);

  const startMiddleCheck = useCallback(() => {
    const allLoaded = areAllProductsLoaded();

    // Ne pas démarrer si tous les produits sont chargés ou si on charge déjà
    if (
      allLoaded ||
      isLoadingMore ||
      isCheckingMiddle.current ||
      noMoreProducts
    ) {
      return;
    }

    clearMiddleCheckInterval(); // S'assurer qu'il n'y a pas d'interval existant

    isCheckingMiddle.current = true;

    checkIntervalRef.current = setInterval(() => {
      checkIfMiddleReached();
    }, 250); // Vérification toutes les 500ms pour éviter trop de calls
  }, [
    isLoadingMore,
    clearMiddleCheckInterval,
    areAllProductsLoaded,
    noMoreProducts,
  ]);

  const checkIfMiddleReached = useCallback(() => {
    const allLoaded = areAllProductsLoaded();

    if (
      !productContainerRef.current ||
      allLoaded ||
      isLoadingMore ||
      noMoreProducts
    ) {
      clearMiddleCheckInterval();
      return;
    }

    productContainerRef.current.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        const screenHeight = Dimensions.get("window").height;
        const containerTop = pageY;
        const containerBottom = containerTop + height;
        const containerMiddle = containerTop + height / 2;

        // Vérifier si la moitié du composant a été dépassée (scrolled past)
        const isMiddlePassed = containerMiddle <= 0;

        if (
          isMiddlePassed &&
          !allLoaded &&
          recommendedProducts.length < totalProducts &&
          !noMoreProducts
        ) {
          loadMoreProducts();
        }
      }
    );
  }, [
    isLoadingMore,
    recommendedProducts.length,
    totalProducts,
    loadMoreProducts,
    clearMiddleCheckInterval,
    areAllProductsLoaded,
    noMoreProducts,
  ]);

  useEffect(() => {
    fetchRecommendedProducts(1, true);
  }, []);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      clearMiddleCheckInterval();
    };
  }, [clearMiddleCheckInterval]);

  return (
    <RecommandationPresenter
      products={recommendedProducts}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      productContainerRef={productContainerRef}
      handleContainerLayout={handleContainerLayout}
      initialSkeletons={generateInitialSkeletons()}
      loadMoreSkeletons={generateLoadMoreSkeletons()}

    />
  );
};

export default Recommandation;

const styles = StyleSheet.create({
  productWrapper: {
    width: "48%",
    marginBottom: 10,
  },
});
