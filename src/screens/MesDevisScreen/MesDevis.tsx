import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert, Linking } from "react-native";
import { useAuth } from "src/hooks/useAuth";
import devisService from "src/services/devisService";
import { Devis, DevisStatus } from "src/types/Devis";
import { PaginationDto } from "src/types/paginationDto";
import MesDevisPresenter from "./MesDevisPresenter";
import { DevisFilter } from "src/components/Devis/DevisFilters/DevisFilters";

const MesDevis = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

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
        if (reset) {
          setLoading(true);
          setPagination({ page: 1, limit: 10 });
        } else {
          setLoadingMore(true);
        }

        const currentPage = reset ? 1 : pagination.page;
        const status = activeFilter === "ALL" ? undefined : activeFilter;
        // Search is always undefined for regular clients (handled by backend)
        const search = undefined;

        const response = await devisService.getDevisByClient(
          user.id,
          status,
          search,
          { page: currentPage, limit: pagination.limit }
        );

        // Handle the API response structure from backend
        const responseData = response?.devis || response?.data || [];
        const meta = response?.meta;
        
        // Ensure we have an array of devis
        const newDevis = Array.isArray(responseData) ? responseData : [];
        
        if (reset) {
          setDevis(newDevis);
        } else {
          setDevis(prev => [...prev, ...newDevis]);
        }

        // Use meta information if available, otherwise fallback to simple check
        if (meta) {
          setHasMore(meta.page < meta.total);
        } else {
          setHasMore(newDevis.length === pagination.limit);
        }
        
        if (!reset && currentPage) {
          setPagination(prev => ({ ...prev, page: currentPage + 1 }));
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
    [user?.id, isAuthenticated, pagination.page, pagination.limit]
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

      const status = activeFilter === "ALL" ? undefined : activeFilter;
      // Search is always undefined for regular clients (handled by backend)
      const search = undefined;

      const response = await devisService.getDevisByClient(
        user.id,
        status,
        search,
        { page: 1, limit: 10 }
      );

      // Handle the API response structure from backend
      const responseData = response?.devis || response?.data || [];
      const meta = response?.meta;
      
      // Ensure we have an array of devis
      const newDevis = Array.isArray(responseData) ? responseData : [];
      
      setDevis(newDevis);

      // Use meta information if available, otherwise fallback to simple check
      if (meta) {
        setHasMore(meta.page < meta.total);
      } else {
        setHasMore(newDevis.length === 10);
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
    // Always reload data when filter changes
    reloadDataForFilter();
  }, [activeFilter, reloadDataForFilter]);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      reloadDataForFilter();
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