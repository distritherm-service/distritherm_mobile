import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert, Linking } from "react-native";
import { useAuth } from "src/hooks/useAuth";
import devisService from "src/services/devisService";
import { Devis, DevisStatus } from "src/types/Devis";
import { PaginationDto } from "src/types/PaginationDto";
import MesDevisPresenter from "./MesDevisPresenter";
import { DevisFilter } from "src/components/Devis/DevisFilters/DevisFilters";

const MesDevis = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // Refs to prevent unnecessary re-renders and double calls
  const isInitialLoad = useRef(true);
  const lastFilterRef = useRef<DevisFilter>("ALL");

  // State management
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DevisFilter>("ALL");
  // Search is disabled for regular clients - only for admin/commercial
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [selectedDevisForProducts, setSelectedDevisForProducts] = useState<Devis | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletingDevisId, setDeletingDevisId] = useState<number | null>(null);

  // Pagination
  const [pagination, setPagination] = useState<PaginationDto>({
    page: 1,
    limit: 10,
  });

  // Load devis from API
  const loadDevis = useCallback(
    async (reset: boolean = false) => {
      if (!user?.id || !isAuthenticated) return;

      try {
        setError(null);
        let currentPage: number;
        
        if (reset) {
          setLoading(true);
          currentPage = 1;
          setPagination({ page: 1, limit: 10 });
        } else {
          setLoadingMore(true);
          currentPage = pagination.page || 1;
        }

        const status = activeFilter === "ALL" ? undefined : activeFilter;
        // Search is always undefined for regular clients (handled by backend)
        const search = undefined;

        const response = await devisService.getDevisByClient(
          user.id,
          status,
          search,
          { page: currentPage, limit: pagination.limit }
        );

        // Debug logging
        // Handle the API response structure from backend
        const responseData = response?.data?.devis || response?.devis || [];
        const meta = response?.data?.meta || response?.meta;
        
        // Ensure we have an array of devis
        const newDevis = Array.isArray(responseData) ? responseData : [];
        
        // Remove duplicates by filtering out existing devis IDs
        const existingIds = reset ? new Set() : new Set(devis.map(d => d.id));
        const uniqueNewDevis = newDevis.filter(d => !existingIds.has(d.id));
        
        if (reset) {
          setDevis(uniqueNewDevis);
        } else {
          setDevis(prev => [...prev, ...uniqueNewDevis]);
        }

        // Use meta information if available, otherwise fallback to simple check
        if (meta) {
          // Check different possible pagination structures
          const hasNext = meta.hasNext ?? 
                         meta.hasNextPage ?? 
                         (meta.page && meta.lastPage && meta.page < meta.lastPage) ??
                         (meta.currentPage && meta.totalPages && meta.currentPage < meta.totalPages);
          setHasMore(hasNext || false);
        } else {
          setHasMore(uniqueNewDevis.length === pagination.limit);
        }
        
        // Update pagination page only after successful load and if not reset
        if (!reset && uniqueNewDevis.length > 0) {
          setPagination(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
      } catch (err: any) {
        console.error("Error loading devis:", err);
        const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos devis";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user?.id, isAuthenticated, activeFilter, pagination.page, pagination.limit, devis]
  );

  // Download devis file
  const downloadDevis = useCallback(async (devisId: number) => {
    setDownloadingIds(prev => new Set(prev).add(devisId));
    
    try {
      Alert.alert("Succès", "Téléchargement effectué");
    } catch (err: any) {
      console.error("Error downloading devis:", err);
      Alert.alert("Erreur", "Impossible de télécharger le devis");
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(devisId);
        return newSet;
      });
    }
  }, []);

  // Delete devis
  const deleteDevis = useCallback(async (devisId: number) => {
    setDeletingDevisId(devisId);
    
    try {
      await devisService.deleteDevis(devisId);
      
      // Remove the deleted devis from the list
      setDevis(prev => prev.filter(d => d.id !== devisId));
      
      Alert.alert("Succès", "Le devis a été supprimé avec succès");
    } catch (err: any) {
      console.error("Error deleting devis:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Impossible de supprimer le devis";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setDeletingDevisId(null);
    }
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDevis(true);
  }, [loadDevis]);

  // Load more data
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      loadDevis(false);
    }
  }, [loadingMore, hasMore, loading, loadDevis]);

  // Filter change
  const handleFilterChange = useCallback((filter: DevisFilter) => {
    if (filter !== activeFilter) {
      setActiveFilter(filter);
      lastFilterRef.current = filter;
    }
  }, [activeFilter]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Navigate to login
  const navigateToLogin = useCallback(() => {
    (navigation as any).navigate("Auth", { screen: "Login" });
  }, [navigation]);

  // Handle view products
  const handleViewProducts = useCallback((devis: Devis) => {
    setSelectedDevisForProducts(devis);
    setModalVisible(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedDevisForProducts(null);
  }, []);

  // Reload data when filter or search changes  
  const reloadDataForFilter = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    
    try {
      setError(null);
      setLoading(true);
      setPagination({ page: 1, limit: 10 });
      setDevis([]);
      setHasMore(true);

      const status = activeFilter === "ALL" ? undefined : activeFilter;
      // Search is always undefined for regular clients (handled by backend)
      const search = undefined;

      const response = await devisService.getDevisByClient(
        user.id,
        status,
        search,
        { page: 1, limit: 10 }
      );

      // Debug logging
      // Handle the API response structure from backend
      const responseData = response?.data?.devis || response?.devis || [];
      const meta = response?.data?.meta || response?.meta;
      
      // Ensure we have an array of devis and remove any potential duplicates
      const newDevis = Array.isArray(responseData) ? responseData : [];
      const uniqueDevis = newDevis.filter((devis, index, self) => 
        index === self.findIndex(d => d.id === devis.id)
      );
      
      setDevis(uniqueDevis);

      // Use meta information if available, otherwise fallback to simple check
      if (meta) {
        // Check different possible pagination structures
        const hasNext = meta.hasNext ?? 
                       meta.hasNextPage ?? 
                       (meta.page && meta.lastPage && meta.page < meta.lastPage) ??
                       (meta.currentPage && meta.totalPages && meta.currentPage < meta.totalPages);
        setHasMore(hasNext || false);
      } else {
        setHasMore(uniqueDevis.length === 10);
      }
    } catch (err: any) {
      console.error("Error reloading devis:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Impossible de charger vos devis";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, activeFilter]);

  // Load data when filter changes (search is disabled for clients)
  useEffect(() => {
    // Only reload data when filter actually changes (not initial load)
    if (!isInitialLoad.current && lastFilterRef.current !== activeFilter) {
      reloadDataForFilter();
      lastFilterRef.current = activeFilter;
    }
  }, [activeFilter, reloadDataForFilter]);

  // Load data when screen is focused (only on initial load or when returning from background)
  useFocusEffect(
    useCallback(() => {
      if (isInitialLoad.current) {
        reloadDataForFilter();
        isInitialLoad.current = false;
      }
    }, [reloadDataForFilter])
  );

  const getStatusText = (status: DevisStatus): string => {
    switch (status) {
      case DevisStatus.SENDED:
        return "Envoyé";
      case DevisStatus.CONSULTED:
        return "Consulté";
      case DevisStatus.PROGRESS:
        return "En cours";
      case DevisStatus.EXPIRED:
        return "Expiré";
      default:
        return status;
    }
  };

  const getStatusColor = (status: DevisStatus): string => {
    switch (status) {
      case DevisStatus.SENDED:
        return "#3B82F6"; // Blue
      case DevisStatus.CONSULTED:
        return "#10B981"; // Green
      case DevisStatus.PROGRESS:
        return "#F59E0B"; // Orange
      case DevisStatus.EXPIRED:
        return "#EF4444"; // Red
      default:
        return "#6B7280"; // Gray
    }
  };

  return (
    <MesDevisPresenter
      devis={devis}
      loading={loading}
      refreshing={refreshing}
      loadingMore={loadingMore}
      error={error}
      activeFilter={activeFilter}
      downloadingIds={downloadingIds}
      deletingDevisId={deletingDevisId}
      isAuthenticated={isAuthenticated}
      selectedDevisForProducts={selectedDevisForProducts}
      modalVisible={modalVisible}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onFilterChange={handleFilterChange}
      onDownload={downloadDevis}
      onDelete={deleteDevis}
      onViewProducts={handleViewProducts}
      onCloseModal={handleCloseModal}
      onBack={handleBack}
      onNavigateToLogin={navigateToLogin}
      getStatusText={getStatusText}
      getStatusColor={getStatusColor}
    />
  );
};

export default MesDevis; 