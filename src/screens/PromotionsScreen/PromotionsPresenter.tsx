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
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductItem from "src/components/ProductItem/ProductItem";
import { useColors } from "src/hooks/useColors";
import { PromotionDto } from "src/services/promotionsService";
import { ProductBasicDto } from "src/types/Product";
import { Dimensions } from "react-native";

interface PromotionsPresenterProps {
  promotions: PromotionDto[];
  products: ProductBasicDto[];
  promotionsCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isLoadingMore: boolean;
  hasMorePages: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onNavigateBack: () => void;
}

const PromotionsPresenter: React.FC<PromotionsPresenterProps> = ({
  promotions,
  products,
  promotionsCount,
  isLoading,
  isRefreshing,
  error,
  isLoadingMore,
  hasMorePages,
  onRefresh,
  onLoadMore,
  onRetry,
  onNavigateBack,
}) => {
  const colors = useColors();
  const { width } = Dimensions.get("window");

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    // Header styles
    headerContainer: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      shadowColor: colors.text,
      paddingHorizontal: ms(20),
      paddingVertical: ms(16),
      borderBottomWidth: 1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: ms(12), // Using react-native-size-matters for responsive gap
    },
    headerIconContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.secondary[200],
      width: ms(40), // Using react-native-size-matters for responsive width
      height: ms(40), // Using react-native-size-matters for responsive height
      borderRadius: ms(20),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    headerTitle: {
      color: colors.text,
      fontSize: ms(18), // Using react-native-size-matters - reduced from ms(20) for consistency
      fontWeight: "700",
      flex: 1,
    },
    headerCount: {
      backgroundColor: colors.secondary[500],
      color: colors.surface,
      minWidth: ms(32), // Using react-native-size-matters for responsive width
      height: ms(32), // Using react-native-size-matters for responsive height
      borderRadius: ms(16),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(8),
    },
    headerCountText: {
      fontSize: ms(14),
      fontWeight: "600",
    },
    // Common styles
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(20),
    },
    // Loading state styles
    loadingContainer: {
      backgroundColor: colors.primary[50],
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(20),
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: ms(16),
      marginTop: ms(16),
    },
    // Error state styles
    errorContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.danger[200],
      shadowColor: colors.text,
      borderRadius: ms(16),
      padding: ms(32),
      alignItems: "center",
      borderWidth: 1,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      maxWidth: ms(320),
    },
    errorTitle: {
      color: colors.danger[600],
      fontSize: ms(18), // Using react-native-size-matters - reduced from ms(20) for consistency
      fontWeight: "700",
      textAlign: "center",
      marginTop: ms(16),
      marginBottom: ms(8),
    },
    errorDescription: {
      color: colors.danger[500],
      fontSize: ms(16),
      textAlign: "center",
      lineHeight: ms(24),
      marginBottom: ms(14),
    },
    retryButton: {
      backgroundColor: colors.danger[500],
      shadowColor: colors.text,
      paddingHorizontal: ms(24),
      paddingVertical: ms(12),
      borderRadius: ms(8),
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    retryButtonPressed: {
      backgroundColor: colors.danger[600],
    },
    retryButtonText: {
      color: colors.surface,
      fontSize: ms(16),
      fontWeight: "600",
    },
    // Empty state styles
    emptyContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.text,
      borderRadius: ms(16),
      padding: ms(32),
      alignItems: "center",
      borderWidth: 1,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      maxWidth: ms(320),
    },
    emptyTitle: {
      color: colors.text,
      fontSize: ms(18), // Using react-native-size-matters - reduced from ms(20) for consistency
      fontWeight: "700",
      textAlign: "center",
      marginTop: ms(16),
      marginBottom: ms(8),
    },
    emptyDescription: {
      color: colors.textSecondary,
      fontSize: ms(16),
      textAlign: "center",
      lineHeight: ms(24),
    },
    // List styles
    listContent: {
      paddingHorizontal: ms(16),
      paddingTop: ms(16),
      paddingBottom: ms(20),
    },
    promotionItemStyle: {
      flex: 1,
      marginHorizontal: ms(8),
      marginBottom: ms(16),
      borderRadius: ms(16),
      overflow: "hidden",
    },

    // Load more styles
    loadMoreContainer: {
      backgroundColor: colors.background,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: ms(16),
      gap: ms(8), // Using react-native-size-matters for responsive gap
    },
    loadMoreText: {
      color: colors.primary[500],
      fontSize: ms(14),
      fontWeight: "500",
    },
  });

  // Custom header component
  const renderHeader = () => (
    <View style={dynamicStyles.headerContainer}>
      <View style={dynamicStyles.headerContent}>
        <View style={dynamicStyles.headerIconContainer}>
          <FontAwesome6
            name="tags"
            size={ms(20)} // Using react-native-size-matters for responsive icon size
            color={colors.secondary[500]}
            solid
          />
        </View>
        <Text style={dynamicStyles.headerTitle}>Promotions</Text>
        <View style={dynamicStyles.headerCount}>
          <Text
            style={[dynamicStyles.headerCountText, { color: colors.surface }]}
          >
            {promotionsCount}
          </Text>
        </View>
      </View>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={dynamicStyles.loadingText}>
        Chargement des promotions...
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={dynamicStyles.centeredContainer}>
      <View style={dynamicStyles.errorContainer}>
        <FontAwesome6
          name="triangle-exclamation"
          size={ms(48)} // Using react-native-size-matters for responsive icon size
          color={colors.danger[500]}
        />

        <Text style={dynamicStyles.errorTitle}>Erreur de chargement</Text>

        <Text style={dynamicStyles.errorDescription}>{error}</Text>

        <Pressable
          style={({ pressed }) => [
            dynamicStyles.retryButton,
            pressed && dynamicStyles.retryButtonPressed,
          ]}
          onPress={onRetry}
        >
          <Text style={dynamicStyles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={dynamicStyles.centeredContainer}>
      <View style={dynamicStyles.emptyContainer}>
        <FontAwesome6 
          name="tags" 
          size={ms(64)} // Using react-native-size-matters for responsive icon size
          color={colors.primary[300]} 
        />

        <Text style={dynamicStyles.emptyTitle}>
          Aucune promotion disponible
        </Text>

        <Text style={dynamicStyles.emptyDescription}>
          Les nouvelles promotions apparaîtront ici dès qu'elles seront disponibles !
        </Text>
      </View>
    </View>
  );



  // Render product item
  const renderProductItem = ({ item }: { item: ProductBasicDto }) => (
    <View style={dynamicStyles.promotionItemStyle}>
      <ProductItem
        product={item}
      />
    </View>
  );

  // Render load more footer
  const renderLoadMoreFooter = () => {
    if (!isLoadingMore || !hasMorePages) return null;

    return (
      <View style={dynamicStyles.loadMoreContainer}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
        <Text style={dynamicStyles.loadMoreText}>Chargement...</Text>
      </View>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (products.length != 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={dynamicStyles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderLoadMoreFooter}
      />
    );
  };

  return (
    <PageContainer
      headerBack={true}
      headerTitle="Promotions"
      bottomBar={false}
      style={dynamicStyles.container}
      onCustomBack={onNavigateBack}
    >
      {renderContent()}
    </PageContainer>
  );
};

export default PromotionsPresenter; 