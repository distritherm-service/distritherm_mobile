import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faHeartCrack,
  faExclamationTriangle,
  faRefresh,
  faStar,
  faGem,
} from "@fortawesome/free-solid-svg-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductItem from "src/components/ProductItem/ProductItem";
import SectionHeader from "src/components/SectionHeader/SectionHeader";
import ErrorState from "src/components/ErrorState/ErrorState";
import UnauthenticatedState from "src/components/UnauthenticatedState/UnauthenticatedState";
import { useColors } from "src/hooks/useColors";
import { ProductBasicDto } from "src/types/Product";

interface FavoritePresenterProps {
  isAuthenticated: boolean;
  favorites: ProductBasicDto[];
  favoritesCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isLoadingMore: boolean;
  hasMorePages: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRemoveFavorite: (productId: number) => void;
  onNavigateToLogin: () => void;
  onRetry: () => void;
}

const FavoritePresenter: React.FC<FavoritePresenterProps> = ({
  isAuthenticated,
  favorites,
  favoritesCount,
  isLoading,
  isRefreshing,
  error,
  isLoadingMore,
  hasMorePages,
  onRefresh,
  onLoadMore,
  onRemoveFavorite,
  onNavigateToLogin,
  onRetry,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },

    // Content area
    contentContainer: {
      flex: 1,
      paddingTop: ms(16), // Smaller than CartScreen (was 24)
    },

    // Loading state
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(24),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      marginTop: ms(16),
      fontWeight: "600",
    },
    // Enhanced list styles
    listContent: {
      paddingHorizontal: ms(16),
      paddingTop: ms(8), // Smaller than before (was 16)
      paddingBottom: ms(20),
    },
    productItemContainer: {
      flex: 1,
      marginHorizontal: ms(6), // Smaller margins for tighter spacing
      marginBottom: ms(12), // Smaller than before (was 16)
      borderRadius: ms(16),
      overflow: "hidden",
      backgroundColor: colors.surface,
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.08,
      shadowRadius: ms(8),
      elevation: 3,
    },
    // Enhanced load more styles
    loadMoreContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: ms(16),
      marginVertical: ms(12),
      borderRadius: ms(16),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: ms(16),
      gap: ms(8),
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.06,
      shadowRadius: ms(6),
      elevation: 2,
    },
    loadMoreText: {
      color: colors.tertiary[500],
      fontSize: ms(14),
      fontWeight: "600",
    },
    // Special empty state for favorites

  });

  // Modern header component using shared SectionHeader
  const renderHeader = () => (
    <SectionHeader
      icon={faHeart}
      title="Mes Favoris"
      subtitle={
        isAuthenticated && favoritesCount > 0
          ? `${favoritesCount} produit${favoritesCount > 1 ? 's' : ''} aimé${favoritesCount > 1 ? 's' : ''}`
          : undefined
      }
      badgeCount={isAuthenticated ? favoritesCount : undefined}
      badgeColor="danger" // Heart-themed red color
      showBadge={isAuthenticated && favoritesCount > 0}
    />
  );

  // Enhanced loading state
  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.tertiary[500]} />
      <Text style={dynamicStyles.loadingText}>
        Chargement de vos favoris...
      </Text>
    </View>
  );

  // Enhanced error state using shared ErrorState component
  const renderErrorState = () => (
    <ErrorState
      description={error || "Une erreur est survenue"}
      onRetry={onRetry}
    />
  );

  // Enhanced unauthenticated state using shared UnauthenticatedState component
  const renderUnauthenticatedState = () => (
    <UnauthenticatedState
      icon={faHeartCrack}
      title="Connectez-vous pour voir vos favoris"
      description="Découvrez et sauvegardez vos produits préférés en vous connectant à votre compte."
      onNavigateToLogin={onNavigateToLogin}
      iconColor="danger"
    />
  );

  // Enhanced empty state
  const renderEmptyState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <FontAwesomeIcon 
        icon={faGem} 
        size={ms(60)}
        color={colors.danger[400]}
      />
      <Text style={dynamicStyles.loadingText}>
        Aucun favori pour le moment
      </Text>
      <Text style={[dynamicStyles.loadingText, { fontSize: ms(12), marginTop: ms(8) }]}>
        Commencez à explorer nos produits !
      </Text>
    </View>
  );

  // Enhanced product item with better styling
  const renderProductItem = ({ item }: { item: ProductBasicDto }) => (
    <View style={dynamicStyles.productItemContainer}>
      <ProductItem
        product={item}
        onPressFavoriteRemove={() => onRemoveFavorite(item.id)}
      />
    </View>
  );

  // Enhanced load more footer
  const renderLoadMoreFooter = () => {
    if (!isLoadingMore || !hasMorePages || favorites.length === 0) return null;

    return (
      <View style={dynamicStyles.loadMoreContainer}>
        <ActivityIndicator size="small" color={colors.tertiary[500]} />
        <Text style={dynamicStyles.loadMoreText}>Chargement...</Text>
      </View>
    );
  };

  // Enhanced content rendering
  const renderContent = () => {
    if (!isAuthenticated) {
      return renderUnauthenticatedState();
    }

    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (favorites.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={dynamicStyles.contentContainer}>
        <FlatList
          data={favorites.filter(item => item && item.id)} // Filter out invalid items
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={dynamicStyles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.tertiary[500]]}
              tintColor={colors.tertiary[500]}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderLoadMoreFooter}
          removeClippedSubviews={true} // Improve performance
          maxToRenderPerBatch={10} // Render in smaller batches
          windowSize={10} // Keep fewer items in memory
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Better column spacing
        />
      </View>
    );
  };

  return (
    <PageContainer
      headerBack={false}
      bottomBar={true}
      style={dynamicStyles.container}
    >
      {renderHeader()}
      {renderContent()}
    </PageContainer>
  );
};

export default FavoritePresenter;
