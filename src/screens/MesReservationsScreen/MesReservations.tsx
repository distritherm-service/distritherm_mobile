import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { useAuth } from "src/hooks/useAuth";
import reservationsService from "@/reservations";
import { EReservation, EReservationStatus, ReservationFilter } from "src/types/Reservation";
import { PaginationDto } from "src/types/PaginationDto";
import MesReservationsPresenter from "./MesReservationsPresenter";

interface ReservationsMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const MesReservationsScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // State management
  const [reservations, setReservations] = useState<EReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("ALL");
  const [cancellingReservationId, setCancellingReservationId] = useState<number | null>(null);
  const [selectedReservationForProducts, setSelectedReservationForProducts] = useState<EReservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Pagination state - simplified to track only current page and meta
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<ReservationsMeta | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Parse dates from API response
  const parseReservationDates = useCallback((reservation: any): EReservation => ({
    ...reservation,
    pickupDate: new Date(reservation.pickupDate),
    createdAt: new Date(reservation.createdAt),
    updatedAt: new Date(reservation.updatedAt),
  }), []);

  // Load reservations from API
  const loadReservations = useCallback(
    async (reset: boolean = false, pageToLoad?: number) => {
      if (!user?.id || !isAuthenticated) return;

      // Calculate the actual page to load
      const actualPageToLoad = reset ? 1 : (pageToLoad || currentPage + 1);
      
      try {
        setError(null);
        
        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const status = activeFilter === "ALL" ? undefined : activeFilter;

        const response = await reservationsService.getReservationsByUser(
          user.id,
          status,
          undefined, // search
          { page: actualPageToLoad, limit: ITEMS_PER_PAGE }
        );

        // Handle the API response structure from backend
        const responseData = response?.reservations || response?.data || [];
        const responseMeta = response?.meta;
        
        // Ensure we have an array of reservations with properly parsed dates
        const newReservations = Array.isArray(responseData) 
          ? responseData.map(parseReservationDates) 
          : [];
        
        if (reset) {
          setReservations(newReservations);
          setCurrentPage(1);
        } else {
          // Only append if we have new data and it's not a duplicate
          if (newReservations.length > 0) {
            setReservations(prev => {
              // Prevent duplicates by filtering out reservations that already exist
              const existingIds = new Set(prev.map(r => r.id));
              const uniqueNewReservations = newReservations.filter(r => !existingIds.has(r.id));
              
              return [...prev, ...uniqueNewReservations];
            });
            setCurrentPage(actualPageToLoad);
          }
        }

        // Update meta information from backend response
        if (responseMeta) {
          setMeta(responseMeta);
        } else {
          // Fallback meta calculation if backend doesn't provide it
          setMeta(prevMeta => {
            const currentTotal = prevMeta?.total || 0;
            const totalItems = reset ? newReservations.length : currentTotal + newReservations.length;
            const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
            return {
              total: totalItems,
              page: actualPageToLoad,
              limit: ITEMS_PER_PAGE,
              lastPage,
              hasNextPage: newReservations.length === ITEMS_PER_PAGE,
              hasPreviousPage: actualPageToLoad > 1,
            };
          });
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
    [user?.id, isAuthenticated, currentPage, activeFilter, parseReservationDates]
  );



  // Cancel reservation
  const cancelReservation = useCallback(async (reservationId: number) => {
    setCancellingReservationId(reservationId);
    
    try {
      // Update reservation status to cancelled using the correct endpoint for clients
      await reservationsService.updateReservationStatus(reservationId, EReservationStatus.CANCELLED);
      
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
  const handleRefresh = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    
    setRefreshing(true);
    
    try {
      setError(null);
      
      // Reset pagination state
      setCurrentPage(1);
      setMeta(null);
      setReservations([]);
      
      const status = activeFilter === "ALL" ? undefined : activeFilter;
      
      const response = await reservationsService.getReservationsByUser(
        user.id,
        status,
        undefined, // search
        { page: 1, limit: ITEMS_PER_PAGE }
      );
      
      // Handle the API response structure from backend
      const responseData = response?.reservations || response?.data || [];
      const responseMeta = response?.meta;
      
      // Ensure we have an array of reservations with properly parsed dates
      const newReservations = Array.isArray(responseData) 
        ? responseData.map(parseReservationDates) 
        : [];
      
      setReservations(newReservations);
      setCurrentPage(1);
      
      // Update meta information from backend response
      if (responseMeta) {
        setMeta(responseMeta);
      } else {
        setMeta({
          total: newReservations.length,
          page: 1,
          limit: ITEMS_PER_PAGE,
          lastPage: Math.ceil(newReservations.length / ITEMS_PER_PAGE),
          hasNextPage: newReservations.length === ITEMS_PER_PAGE,
          hasPreviousPage: false,
        });
      }
      
    } catch (err: any) {
      console.error("Error refreshing reservations:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos réservations";
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, isAuthenticated, activeFilter, parseReservationDates]);

  // Load more data
  const handleLoadMore = useCallback(() => {
    // Check if we can load more based on backend meta information
    const canLoadMore = meta?.hasNextPage ?? false;
    
    if (!loadingMore && canLoadMore && !loading && !refreshing) {
      loadReservations(false);
    }
  }, [loadingMore, loading, refreshing, meta?.hasNextPage, loadReservations]);

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



  // Load data when filter changes
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return;
    
    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Reset pagination state
        setCurrentPage(1);
        setMeta(null);
        setReservations([]);
        
        const status = activeFilter === "ALL" ? undefined : activeFilter;
        
        const response = await reservationsService.getReservationsByUser(
          user.id,
          status,
          undefined, // search
          { page: 1, limit: ITEMS_PER_PAGE }
        );

        
        // Handle the API response structure from backend
        const responseData = response?.reservations || response?.data || [];
        const responseMeta = response?.meta;
        
        // Ensure we have an array of reservations with properly parsed dates
        const newReservations = Array.isArray(responseData) 
          ? responseData.map(parseReservationDates) 
          : [];
        
        setReservations(newReservations);
        setCurrentPage(1);
        
        // Update meta information from backend response
        if (responseMeta) {
          setMeta(responseMeta);
        } else {
          setMeta({
            total: newReservations.length,
            page: 1,
            limit: ITEMS_PER_PAGE,
            lastPage: Math.ceil(newReservations.length / ITEMS_PER_PAGE),
            hasNextPage: newReservations.length === ITEMS_PER_PAGE,
            hasPreviousPage: false,
          });
        }
        
      } catch (err: any) {
        console.error("Error loading initial reservations:", err);
        const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos réservations";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [activeFilter, user?.id, isAuthenticated, parseReservationDates]);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!user?.id || !isAuthenticated) return;
      
      const loadData = async () => {
        try {
          setError(null);
          setLoading(true);
          
          // Reset pagination state
          setCurrentPage(1);
          setMeta(null);
          setReservations([]);
          
          const status = activeFilter === "ALL" ? undefined : activeFilter;
          
          const response = await reservationsService.getReservationsByUser(
            user.id,
            status,
            undefined, // search
            { page: 1, limit: ITEMS_PER_PAGE }
          );
          
          // Handle the API response structure from backend
          const responseData = response?.reservations || response?.data || [];
          const responseMeta = response?.meta;
          
          // Ensure we have an array of reservations with properly parsed dates
          const newReservations = Array.isArray(responseData) 
            ? responseData.map(parseReservationDates) 
            : [];
          
          setReservations(newReservations);
          setCurrentPage(1);
          
          // Update meta information from backend response
          if (responseMeta) {
            setMeta(responseMeta);
          } else {
            setMeta({
              total: newReservations.length,
              page: 1,
              limit: ITEMS_PER_PAGE,
              lastPage: Math.ceil(newReservations.length / ITEMS_PER_PAGE),
              hasNextPage: newReservations.length === ITEMS_PER_PAGE,
              hasPreviousPage: false,
            });
          }
          
        } catch (err: any) {
          console.error("Error loading reservations on focus:", err);
          const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos réservations";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }, [user?.id, isAuthenticated, activeFilter, parseReservationDates])
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