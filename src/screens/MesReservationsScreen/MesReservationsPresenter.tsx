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
  faCalendarCheck,
  faSignInAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import PageContainer from "src/components/PageContainer/PageContainer";
import UnauthenticatedState from "src/components/UnauthenticatedState/UnauthenticatedState";
import ErrorState from "src/components/ErrorState/ErrorState";
import LoadingState from "src/components/LoadingState/LoadingState";
import { EReservation, EReservationStatus, ReservationFilter } from "src/types/Reservation";
import ReservationCard from "src/components/Reservation/ReservationCard/ReservationCard";
import ReservationFilters from "src/components/Reservation/ReservationFilters/ReservationFilters";
import ReservationFicheProduct from "src/components/Reservation/ReservationFicheProduct/ReservationFicheProduct";

interface MesReservationsPresenterProps {
  reservations: EReservation[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  activeFilter: ReservationFilter;
  cancellingReservationId: number | null;
  isAuthenticated: boolean;
  selectedReservationForProducts: EReservation | null;
  modalVisible: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onFilterChange: (filter: ReservationFilter) => void;
  onCancel: (reservationId: number) => void;
  onViewProducts: (reservation: EReservation) => void;
  onCloseModal: () => void;
  onBack: () => void;
  onNavigateToLogin: () => void;
}

const MesReservationsPresenter: React.FC<MesReservationsPresenterProps> = ({
  reservations,
  loading,
  refreshing,
  loadingMore,
  error,
  activeFilter,
  cancellingReservationId,
  isAuthenticated,
  selectedReservationForProducts,
  modalVisible,
  onRefresh,
  onLoadMore,
  onFilterChange,
  onCancel,
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
    storeInfoContainer: {
      backgroundColor: colors.secondary[50],
      paddingHorizontal: ms(20),
      paddingVertical: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.tertiary[200] + "20",
      marginBottom: ms(8),
    },
    storeInfoRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    storeInfoIcon: {
      marginRight: ms(8),
    },
    storeInfoText: {
      fontSize: ms(14),
      color: colors.secondary[600],
      fontWeight: "600" as const,
      textAlign: "center" as const,
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

  // Render reservation item
  const renderReservationItem = ({ item }: { item: EReservation }) => {
    const isCancelling = cancellingReservationId === item.id;
    
    return (
      <ReservationCard
        reservation={item}
        onCancel={onCancel}
        onViewProducts={onViewProducts}
        isCancelling={isCancelling}
      />
    );
  };

  // Render loading state
  if (loading) {
    return (
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Réservations"
        onCustomBack={onBack}
        isScrollable={false}
        bottomBar={false}
      >
        <LoadingState message="Chargement de vos réservations..." />
      </PageContainer>
    );
  }

  // Render unauthenticated state
  if (!isAuthenticated) {
    return (
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Réservations"
        onCustomBack={onBack}
        isScrollable={false}
        bottomBar={false}
      >
        <UnauthenticatedState 
          icon={faSignInAlt}
          title="Connexion requise"
          description="Vous devez être connecté pour consulter vos réservations"
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
        headerTitle="Mes Réservations"
        onCustomBack={onBack}
        isScrollable={false}
        bottomBar={false}
      >
        <ErrorState description={error} onRetry={onRefresh} />
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer 
        headerBack={true}
        headerTitle="Mes Réservations"
        onCustomBack={onBack}
        isScrollable={false}
        bottomBar={false}
      >
        <View style={dynamicStyles.container}>
          {/* Store Address Info */}
          <View style={dynamicStyles.storeInfoContainer}>
            <View style={dynamicStyles.storeInfoRow}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                size={ms(14)}
                color={colors.secondary[600]}
                style={dynamicStyles.storeInfoIcon}
              />
              <Text style={dynamicStyles.storeInfoText}>
                16 Rue Condorcet, Taverny 95150
              </Text>
            </View>
          </View>

          {/* Filters */}
          <ReservationFilters
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />

          {/* Reservations List */}
          {reservations.length === 0 ? (
            <View style={dynamicStyles.emptyContainer}>
              <FontAwesomeIcon
                icon={faCalendarCheck}
                size={ms(64)}
                color={colors.tertiary[400]}
                style={dynamicStyles.emptyIcon}
              />
              <Text style={dynamicStyles.emptyTitle}>
                Aucune réservation trouvée
              </Text>
              <Text style={dynamicStyles.emptySubtitle}>
                {activeFilter === "ALL"
                  ? "Vous n'avez pas encore de réservation. Ajoutez des produits à votre panier et réservez !"
                  : "Aucune réservation ne correspond à vos critères de filtre."}
              </Text>
            </View>
          ) : (
            <FlatList
              style={dynamicStyles.listContainer}
              data={reservations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderReservationItem}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.secondary[500]]}
                  tintColor={colors.secondary[500]}
                />
              }
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loadingMore ? (
                  <View style={dynamicStyles.loadMoreContainer}>
                    <ActivityIndicator size="small" color={colors.secondary[500]} />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={21}
            />
          )}
        </View>
      </PageContainer>

      {/* Products Modal */}
      <ReservationFicheProduct
        visible={modalVisible}
        reservation={selectedReservationForProducts}
        onClose={onCloseModal}
      />
    </>
  );
};

export default MesReservationsPresenter; 