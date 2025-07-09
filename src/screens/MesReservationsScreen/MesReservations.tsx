import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { useAuth } from "src/hooks/useAuth";
import reservationsService from "src/services/reservationsService";
import { EReservation, EReservationStatus, ReservationFilter } from "src/types/Reservation";
import { PaginationDto } from "src/types/PaginationDto";
import MesReservationsPresenter from "./MesReservationsPresenter";

const MesReservationsScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // State management
  const [reservations, setReservations] = useState<EReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("ALL");
  const [cancellingReservationId, setCancellingReservationId] = useState<number | null>(null);
  const [selectedReservationForProducts, setSelectedReservationForProducts] = useState<EReservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState<PaginationDto>({
    page: 1,
    limit: 10,
  });

  // Parse dates from API response
  const parseReservationDates = useCallback((reservation: any): EReservation => ({
    ...reservation,
    pickupDate: new Date(reservation.pickupDate),
    createdAt: new Date(reservation.createdAt),
    updatedAt: new Date(reservation.updatedAt),
  }), []);

  // Load reservations from API
  const loadReservations = useCallback(
    async (reset: boolean = false) => {
      if (!user?.id || !isAuthenticated) return;

      try {
        setError(null);
        if (reset) {
          setLoading(true);
          setPagination({ page: 1, limit: 10 });
        } else {
          setLoadingMore(true);
        }

        const currentPage = reset ? 1 : pagination.page;
        const status = activeFilter === "ALL" ? undefined : activeFilter;

        const response = await reservationsService.getReservationsByUser(
          user.id,
          status,
          undefined, // search
          { page: currentPage, limit: pagination.limit }
        );

        // Handle the API response structure from backend
        const responseData = response?.reservations || response?.data || [];
        const meta = response?.meta;
        
        // Ensure we have an array of reservations with properly parsed dates
        const newReservations = Array.isArray(responseData) 
          ? responseData.map(parseReservationDates) 
          : [];
        
        if (reset) {
          setReservations(newReservations);
        } else {
          setReservations(prev => [...prev, ...newReservations]);
        }

        // Use meta information if available, otherwise fallback to simple check
        if (meta) {
          setHasMore(meta.page < meta.total);
        } else {
          setHasMore(newReservations.length === pagination.limit);
        }
        
        if (!reset && currentPage) {
          setPagination(prev => ({ ...prev, page: currentPage + 1 }));
        }
      } catch (err: any) {
        console.error("Error loading reservations:", err);
        const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos réservations";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user?.id, isAuthenticated, pagination.page, pagination.limit, activeFilter, parseReservationDates]
  );

  // Cancel reservation
  const cancelReservation = useCallback(async (reservationId: number) => {
    setCancellingReservationId(reservationId);
    
    try {
      // Update reservation status to cancelled
      await reservationsService.updateReservation(reservationId, {
        status: EReservationStatus.CANCELLED
      });
      
      // Update the reservation status in the list
      setReservations(prev => prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: EReservationStatus.CANCELLED, updatedAt: new Date() }
          : r
      ));
      
      Alert.alert("Succès", "La réservation a été annulée avec succès");
    } catch (err: any) {
      console.error("Error cancelling reservation:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Impossible d'annuler la réservation";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setCancellingReservationId(null);
    }
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadReservations(true);
  }, [loadReservations]);

  // Load more data
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      loadReservations(false);
    }
  }, [loadingMore, hasMore, loading, loadReservations]);

  // Filter change
  const handleFilterChange = useCallback((filter: ReservationFilter) => {
    setActiveFilter(filter);
  }, []);

  // Navigate back
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Navigate to login
  const navigateToLogin = useCallback(() => {
    (navigation as any).navigate("Auth", { screen: "Login" });
  }, [navigation]);

  // Handle view products
  const handleViewProducts = useCallback((reservation: EReservation) => {
    setSelectedReservationForProducts(reservation);
    setModalVisible(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedReservationForProducts(null);
  }, []);

  // Reload data when filter changes  
  const reloadDataForFilter = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    
    try {
      setError(null);
      setLoading(true);
      setPagination({ page: 1, limit: 10 });
      setReservations([]);

      const status = activeFilter === "ALL" ? undefined : activeFilter;

      const response = await reservationsService.getReservationsByUser(
        user.id,
        status,
        undefined, // search
        { page: 1, limit: 10 }
      );

      // Handle the API response structure from backend
      const responseData = response?.reservations || response?.data || [];
      const meta = response?.meta;
      
      // Ensure we have an array of reservations with properly parsed dates
      const newReservations = Array.isArray(responseData) 
        ? responseData.map(parseReservationDates) 
        : [];
      
      setReservations(newReservations);

      // Use meta information if available, otherwise fallback to simple check
      if (meta) {
        setHasMore(meta.page < meta.total);
      } else {
        setHasMore(newReservations.length === 10);
      }
    } catch (err: any) {
      console.error("Error reloading reservations:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos réservations";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, activeFilter, parseReservationDates]);

  // Load data when filter changes
  useEffect(() => {
    reloadDataForFilter();
  }, [activeFilter, reloadDataForFilter]);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      reloadDataForFilter();
    }, [reloadDataForFilter])
  );

  return (
    <MesReservationsPresenter
      reservations={reservations}
      loading={loading}
      refreshing={refreshing}
      loadingMore={loadingMore}
      error={error}
      activeFilter={activeFilter}
      cancellingReservationId={cancellingReservationId}
      isAuthenticated={isAuthenticated}
      selectedReservationForProducts={selectedReservationForProducts}
      modalVisible={modalVisible}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onFilterChange={handleFilterChange}
      onCancel={cancelReservation}
      onViewProducts={handleViewProducts}
      onCloseModal={handleCloseModal}
      onBack={handleBack}
      onNavigateToLogin={navigateToLogin}
    />
  );
};

export default MesReservationsScreen; 