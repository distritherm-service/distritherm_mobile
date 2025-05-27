import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import RecommandationPresenter from "./RecommandationPresenter";
import productsService from "src/services/productsService";
import { ProductBasicDto } from "src/types/Product";

const Recommandation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<ProductBasicDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [middleReached, setMiddleReached] = useState(false);
  const productContainerRef = useRef<View>(null);
  let checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animations pour les loading states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1Anim = useRef(new Animated.Value(0.6)).current;
  const dot2Anim = useRef(new Animated.Value(0.6)).current;
  const dot3Anim = useRef(new Animated.Value(0.6)).current;

  const ITEMS_PER_PAGE = 10;

  // Gestion des animations d'entrée/sortie
  useEffect(() => {
    if (isLoading || isLoadingMore) {
      if (checkIntervalRef?.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Animation de pulsation continue
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Animation des points avec délais
      const dotsAnimation = Animated.loop(
        Animated.stagger(200, [
          Animated.sequence([
            Animated.timing(dot1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(dot1Anim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dot2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(dot2Anim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dot3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(dot3Anim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          ]),
        ])
      );
      dotsAnimation.start();

      return () => {
        pulseAnimation.stop();
        dotsAnimation.stop();
      };
    } else {
      // Animation de sortie
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      if (!isLoadingMore) {
        startMiddleCheck();
      }

    }
  }, [isLoading, isLoadingMore]);

  const fetchRecommendedProducts = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      try {
        console.log("home");
        if (page === 1) {
          setIsLoading(true);
          // Get total product count on initial load
          const countResponse = await productsService.count();
          setTotalProducts(countResponse.count);
        } else {
          setIsLoadingMore(true);
        }

        // Don't fetch more if we already have all products
        if (recommendedProducts.length >= totalProducts && totalProducts > 0) {
          setIsLoading(false);
          setIsLoadingMore(false);
          return;
        }

        const excludedIds = reset
          ? []
          : recommendedProducts.map((product) => product.id);
        const response = await productsService.getRecommendedProducts(
          excludedIds,
          { page, limit: ITEMS_PER_PAGE }
        );

        if (reset || page === 1) {
          setRecommendedProducts(response.products);
        } else {
          setRecommendedProducts((prev) => [...prev, ...response.products]);
        }

        setCurrentPage(page);
        setError(null);
      } catch (err) {
        setError("Failed to load recommendations");
        if (page === 1) {
          setRecommendedProducts([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [recommendedProducts, totalProducts]
  );

  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && recommendedProducts.length < totalProducts) {
      fetchRecommendedProducts(currentPage + 1);
    }
  }, [currentPage, isLoadingMore, fetchRecommendedProducts, recommendedProducts.length, totalProducts]);

  const handleContainerLayout = () => {
    if (productContainerRef.current && !middleReached && !isLoadingMore) {
      startMiddleCheck();
    }
  };

  const startMiddleCheck = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    checkIntervalRef.current = setInterval(() => {
      checkIfMiddleReached();
    }, 100);
  };

  const checkIfMiddleReached = () => {
    if (productContainerRef.current && !middleReached && !isLoadingMore && recommendedProducts.length < totalProducts) {
      productContainerRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const screenHeight = Dimensions.get('window').height;
        const containerTop = pageY;
        const containerMiddle = containerTop + (height / 2);

        if (containerMiddle >= 0 && containerMiddle <= screenHeight) {
          loadMoreProducts();
          
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchRecommendedProducts(1, true);
  }, []);

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return (
    <RecommandationPresenter
      products={recommendedProducts}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      productContainerRef={productContainerRef}
      handleContainerLayout={handleContainerLayout}
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      pulseAnim={pulseAnim}
      dot1Anim={dot1Anim}
      dot2Anim={dot2Anim}
      dot3Anim={dot3Anim}
    />
  );
};

export default Recommandation;
