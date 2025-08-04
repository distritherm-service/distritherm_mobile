import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import { EReservation, ReservationItem } from "src/types/Reservation";
import reservationsService from "@/reservations";
import ReservationFicheProductPresenter from "./ReservationFicheProductPresenter";

const { height: screenHeight } = Dimensions.get("window");

interface ReservationFicheProductProps {
  visible: boolean;
  reservation: EReservation | null;
  onClose: () => void;
}

const ReservationFicheProduct: React.FC<ReservationFicheProductProps> = ({
  visible,
  reservation,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [reservationItems, setReservationItems] = useState<ReservationItem[]>([]);
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

    reservationItems.forEach((item: ReservationItem) => {
      totalHT += item.totalHt;
      totalTTC += item.totalTtc;
      totalTVA += item.totalTtc - item.totalHt;
      totalQuantity += item.quantity;
    });

    return {
      totalHT,
      totalTTC,
      totalTVA,
      totalQuantity,
      averagePrice: reservationItems.length > 0 ? totalTTC / totalQuantity : 0,
    };
  }, [reservationItems]);

  const fetchReservationDetails = useCallback(
    async (isRefresh = false) => {
      if (!reservation?.id) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        // Fetch reservation details with reservation items
        const response = await reservationsService.getReservationById(reservation.id);

        // Extract reservation items from the response
        const items = response?.reservation?.reservationItems || [];

        // Sort items by product name for better UX
        const sortedItems = items.sort(
          (a: ReservationItem, b: ReservationItem) => {
            return a.productName.localeCompare(b.productName);
          }
        );
        
        setReservationItems(sortedItems);
      } catch (err: any) {
        console.error("Error fetching reservation details:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Impossible de charger les produits de la réservation";
        setError(errorMessage);
        
        // More user-friendly error handling
        if (!isRefresh) {
          Alert.alert("Erreur de chargement", errorMessage, [
            {
              text: "Réessayer",
              onPress: () => fetchReservationDetails(false),
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
    [reservation?.id, onClose]
  );

  const handleRefresh = useCallback(() => {
    fetchReservationDetails(true);
  }, [fetchReservationDetails]);

  const handleRetry = useCallback(() => {
    fetchReservationDetails(false);
  }, [fetchReservationDetails]);

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
    setReservationItems([]);
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
    if (visible && reservation) {
      fetchReservationDetails();
    } else if (!visible) {
      // Reset state when modal is closed for better performance
      setReservationItems([]);
      setError(null);
    }
  }, [visible, reservation, fetchReservationDetails]);

  return (
    <ReservationFicheProductPresenter
      visible={visible}
      reservation={reservation}
      reservationItems={reservationItems}
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

export default ReservationFicheProduct; 