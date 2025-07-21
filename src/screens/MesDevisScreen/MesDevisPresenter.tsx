import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFileInvoiceDollar,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import PageContainer from "src/components/PageContainer/PageContainer";
import UnauthenticatedState from "src/components/UnauthenticatedState/UnauthenticatedState";
import ErrorState from "src/components/ErrorState/ErrorState";
import LoadingState from "src/components/LoadingState/LoadingState";
import { Devis, DevisStatus } from "src/types/Devis";
import DevisFilters, { DevisFilter } from "src/components/Devis/DevisFilters/DevisFilters";
import DevisCard from "src/components/Devis/DevisCard/DevisCard";
// Search functionality disabled for regular clients
// import DevisSearchBar from "src/components/Devis/DevisSearchBar/DevisSearchBar";
import DevisFicheProduct from "src/components/Devis/DevisFicheProduct/DevisFicheProduct";

interface MesDevisPresenterProps {
  devis: Devis[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  activeFilter: DevisFilter;
  downloadingIds: Set<number>;
  deletingDevisId: number | null;
  isAuthenticated: boolean;
  selectedDevisForProducts: Devis | null;
  modalVisible: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onFilterChange: (filter: DevisFilter) => void;
  onDownload: (devisId: number) => void;
  onDelete: (devisId: number) => void;
  onViewProducts: (devis: Devis) => void;
  onCloseModal: () => void;
  onBack: () => void;
  onNavigateToLogin: () => void;
  getStatusText: (status: DevisStatus) => string;
  getStatusColor: (status: DevisStatus) => string;
}

const MesDevisPresenter: React.FC<MesDevisPresenterProps> = ({
  devis,
  loading,
  refreshing,
  loadingMore,
  error,
  activeFilter,
  downloadingIds,
  deletingDevisId,
  isAuthenticated,
  selectedDevisForProducts,
  modalVisible,
  onRefresh,
  onLoadMore,
  onFilterChange,
  onDownload,
  onDelete,
  onViewProducts,
  onCloseModal,
  onBack,
  onNavigateToLogin,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: ms(20),
    },
    loadMoreContainer: {
      paddingVertical: ms(20),
      alignItems: "center" as const,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: ms(60),
      paddingHorizontal: ms(40),
    },
    emptyIcon: {
      marginBottom: ms(20),
    },
    emptyTitle: {
      fontSize: ms(20),
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
      marginBottom: ms(12),
    },
    emptySubtitle: {
      fontSize: ms(16),
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: ms(24),
    },
  };

  // Render devis item (memoized for performance)
  const renderDevisItem = React.useCallback(({ item }: { item: Devis }) => {
    const isDownloading = downloadingIds.has(item.id);
    const isDeleting = deletingDevisId === item.id;
    
    return (
      <DevisCard
        devis={item}
        onDownload={onDownload}
        onViewProducts={onViewProducts}
        onDelete={onDelete}
        isDownloading={isDownloading}
        isDeleting={isDeleting}
      />
    );
  }, [downloadingIds, deletingDevisId, onDownload, onViewProducts, onDelete]);

  // Render loading state
  if (loading) {
    return (
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Devis"
        onCustomBack={onBack}
        isScrollable={false}
      >
        <LoadingState message="Chargement de vos devis..." />
      </PageContainer>
    );
  }

  // Render unauthenticated state
  if (!isAuthenticated) {
    return (
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Devis"
        onCustomBack={onBack}
        isScrollable={false}
      >
        <UnauthenticatedState 
          icon={faSignInAlt}
          title="Connexion requise"
          description="Vous devez être connecté pour consulter vos devis"
          onNavigateToLogin={onNavigateToLogin} 
        />
      </PageContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Devis"
        onCustomBack={onBack}
        isScrollable={false}
      >
        <ErrorState description={error} onRetry={onRefresh} />
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Devis"
        onCustomBack={onBack}
        isScrollable={false}
      >
        <View style={dynamicStyles.container}>
          {/* Filters */}
          <DevisFilters
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />

          {/* Devis List */}
          {devis.length === 0 ? (
            <View style={dynamicStyles.emptyContainer}>
              <FontAwesomeIcon
                icon={faFileInvoiceDollar}
                size={ms(64)}
                color={colors.tertiary[400]}
                style={dynamicStyles.emptyIcon}
              />
              <Text style={dynamicStyles.emptyTitle}>Aucun devis trouvé</Text>
              <Text style={dynamicStyles.emptySubtitle}>
                {activeFilter === "ALL"
                  ? "Vous n'avez pas encore de devis. Ajoutez des produits à votre panier et demandez un devis !"
                  : "Aucun devis ne correspond à vos critères de filtre."}
              </Text>
            </View>
          ) : (
            <FlatList
              style={dynamicStyles.listContainer}
              data={devis}
              keyExtractor={(item, index) => `devis-${item.id}-${index}`}
              renderItem={renderDevisItem}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary[500]]}
                  tintColor={colors.primary[500]}
                />
              }
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loadingMore ? (
                  <View style={dynamicStyles.loadMoreContainer}>
                    <ActivityIndicator size="small" color={colors.primary[500]} />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={10}
              getItemLayout={(data, index) => ({
                length: 200, // Estimated item height
                offset: 200 * index,
                index,
              })}
            />
          )}
        </View>
      </PageContainer>

      {/* Products Modal */}
      <DevisFicheProduct
        visible={modalVisible}
        devis={selectedDevisForProducts}
        onClose={onCloseModal}
      />
    </>
  );
};

export default MesDevisPresenter; 