import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import { Devis } from "src/types/Devis";
import { CartItemWithProduct } from "src/types/Cart";
import devisService from "src/services/devisService";
import DevisFicheProductPresenter from "./DevisFicheProductPresenter";

const { height: screenHeight } = Dimensions.get("window");

interface DevisFicheProductProps {
  visible: boolean;
  devis: Devis | null;
  onClose: () => void;
}

const DevisFicheProduct: React.FC<DevisFicheProductProps> = ({
  visible,
  devis,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Enhanced calculations with memoization for better performance
  const calculations = useMemo(() => {
    let totalHT = 0;
    let totalTTC = 0;
    let totalTVA = 0;
    let totalQuantity = 0;

    cartItems.forEach((item: CartItemWithProduct) => {
      const itemTotalHT = item.priceHt * item.quantity;
      const itemTotalTTC = item.priceTtc * item.quantity;
      
      totalHT += itemTotalHT;
      totalTTC += itemTotalTTC;
      totalTVA += itemTotalTTC - itemTotalHT;
      totalQuantity += item.quantity;
    });

    return {
      totalHT,
      totalTTC,
      totalTVA,
      totalQuantity,
      averagePrice: cartItems.length > 0 ? totalTTC / totalQuantity : 0,
    };
  }, [cartItems]);

  const fetchDevisDetails = useCallback(
    async (isRefresh = false) => {
      if (!devis?.id) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await devisService.getDevisById(devis.id);

        // Extract cart items with products from the response
        const cartItems = response?.devis?.cart?.cartItems || [];

        // Sort products by name for better UX
        const sortedItems = cartItems.sort(
          (a: CartItemWithProduct, b: CartItemWithProduct) => {
            const nameA = a.product?.name || "";
            const nameB = b.product?.name || "";
            return nameA.localeCompare(nameB);
          }
        );
        
        setCartItems(sortedItems);
      } catch (err: any) {
        console.error("Error fetching devis details:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Impossible de charger les produits du devis";
        setError(errorMessage);
        
        // More user-friendly error handling
        if (!isRefresh) {
          Alert.alert("Erreur de chargement", errorMessage, [
            {
              text: "Réessayer",
              onPress: () => fetchDevisDetails(false),
            },
            {
              text: "Fermer",
              style: "cancel",
              onPress: onClose,
            },
          ]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [devis?.id, onClose]
  );

  const handleRefresh = useCallback(() => {
    fetchDevisDetails(true);
  }, [fetchDevisDetails]);

  const handleRetry = useCallback(() => {
    fetchDevisDetails(false);
  }, [fetchDevisDetails]);


  // Format price utility
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  }, []);

  // Enhanced close handler with animation preparation
  const handleClose = useCallback(() => {
    // Reset state when closing for better next opening experience
    setError(null);
    setCartItems([]);
    onClose();
  }, [onClose]);

  // Modal animations
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  useEffect(() => {
    if (visible && devis) {
      fetchDevisDetails();
    } else if (!visible) {
      // Reset state when modal is closed for better performance
      setCartItems([]);
      setError(null);
    }
  }, [visible, devis, fetchDevisDetails]);

  return (
    <DevisFicheProductPresenter
      visible={visible}
      devis={devis}
      cartItems={cartItems}
      loading={loading}
      refreshing={refreshing}
      error={error}
      calculations={calculations}
      slideAnim={slideAnim}
      fadeAnim={fadeAnim}
      formatPrice={formatPrice}
      onClose={handleClose}
      onRefresh={handleRefresh}
      onRetry={handleRetry}
    />
  );
};

export default DevisFicheProduct;
