import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductItem from "src/components/ProductItem/ProductItem";
import { useColors } from "src/hooks/useColors";
import { PromotionDto } from "src/services/promotionsService";
import { ProductBasicDto } from "src/types/Product";
import { Category } from "src/types/Category";
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
  categories: Category[];
  selectedCategoryId: number | null;
  isCategoriesLoading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onNavigateBack: () => void;
  onCategorySelect: (categoryId: number | null) => void;
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
  categories,
  selectedCategoryId,
  isCategoriesLoading,
  onRefresh,
  onLoadMore,
  onRetry,
  onNavigateBack,
  onCategorySelect,
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

    // Category filter styles - Using react-native-size-matters for responsiveness
    categoryFilterContainer: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      shadowColor: colors.text,
      paddingVertical: ms(16),
      borderBottomWidth: 1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    categoryFilterTitle: {
      color: colors.text,
      fontSize: ms(16),
      fontWeight: "600",
      marginHorizontal: ms(20),
      marginBottom: ms(12),
    },
    categoryScrollContainer: {
      paddingHorizontal: ms(12), // Using react-native-size-matters for responsive padding
    },
    categoryChip: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      paddingHorizontal: ms(16), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(10), // Using react-native-size-matters for responsive padding
      borderRadius: ms(20),
      marginHorizontal: ms(4), // Using react-native-size-matters for responsive margin
      borderWidth: 1.5,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      minWidth: ms(80), // Using react-native-size-matters for responsive min width
      alignItems: "center",
    },
    categoryChipSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[600],
      shadowColor: colors.primary[500],
      shadowOpacity: 0.3,
      elevation: 6,
    },
    categoryChipText: {
      color: colors.text,
      fontSize: ms(14),
      fontWeight: "500",
      textAlign: "center",
    },
    categoryChipTextSelected: {
      color: colors.surface,
      fontWeight: "600",
    },
    categoryLoadingContainer: {
      paddingHorizontal: ms(20),
      paddingVertical: ms(8), // Using react-native-size-matters for responsive padding
      alignItems: "center",
    },
    categoryLoadingText: {
      color: colors.textSecondary,
      fontSize: ms(12),
      marginTop: ms(4), // Using react-native-size-matters for responsive margin
    },
  });

  // Render category filter chip
  const renderCategoryChip = ({ item }: { item: Category }) => {
    const isSelected = selectedCategoryId === item.id;
    
    return (
      <Pressable
        style={[
          dynamicStyles.categoryChip,
          isSelected && dynamicStyles.categoryChipSelected,
        ]}
        onPress={() => onCategorySelect(isSelected ? null : item.id)}
      >
        <Text
          style={[
            dynamicStyles.categoryChipText,
            isSelected && dynamicStyles.categoryChipTextSelected,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  // Render category filter
  const renderCategoryFilter = () => {
    if (isCategoriesLoading) {
      return (
        <View style={dynamicStyles.categoryFilterContainer}>
          <Text style={dynamicStyles.categoryFilterTitle}>Filtrer par catégorie</Text>
          <View style={dynamicStyles.categoryLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={dynamicStyles.categoryLoadingText}>
              Chargement des catégories...
            </Text>
          </View>
        </View>
      );
    }

    if (categories.length === 0) {
      return null;
    }

    // Add "Toutes" option at the beginning
    const allCategoriesOption = {
      id: 0,
      name: "Toutes",
      level: 0,
      alias: "ALL",
      haveParent: false,
      haveChildren: false,
      agenceId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const categoryOptions = [allCategoriesOption, ...categories];

    return (
      <View style={dynamicStyles.categoryFilterContainer}>
        <Text style={dynamicStyles.categoryFilterTitle}>Filtrer par catégorie</Text>
        <FlatList
          data={categoryOptions}
          renderItem={({ item }) => (
            <Pressable
              style={[
                dynamicStyles.categoryChip,
                (selectedCategoryId === null && item.id === 0) || selectedCategoryId === item.id
                  ? dynamicStyles.categoryChipSelected
                  : {},
              ]}
              onPress={() => onCategorySelect(item.id === 0 ? null : item.id)}
            >
              <Text
                style={[
                  dynamicStyles.categoryChipText,
                  (selectedCategoryId === null && item.id === 0) || selectedCategoryId === item.id
                    ? dynamicStyles.categoryChipTextSelected
                    : {},
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.categoryScrollContainer}
        />
      </View>
    );
  };

  // Render loading state
  const renderLoadingState = () => (
    <View style={[dynamicStyles.loadingContainer, { flex: 1 }]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={dynamicStyles.loadingText}>
        Chargement des promotions...
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={[dynamicStyles.centeredContainer, { flex: 1 }]}>
      <View style={dynamicStyles.errorContainer}>
        <FontAwesome6
          name="triangle-exclamation"
          size={ms(48)} 
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
    <View style={[dynamicStyles.centeredContainer, { flex: 1 }]}>
      <View style={dynamicStyles.emptyContainer}>
        <FontAwesome6 
          name="tags" 
          size={ms(64)} 
          color={colors.primary[300]} 
        />

        <Text style={dynamicStyles.emptyTitle}>
          {selectedCategoryId ? "Aucune promotion dans cette catégorie" : "Aucune promotion disponible"}
        </Text>

        <Text style={dynamicStyles.emptyDescription}>
          {selectedCategoryId 
            ? "Essayez de sélectionner une autre catégorie ou consultez toutes les promotions."
            : "Les nouvelles promotions apparaîtront ici dès qu'elles seront disponibles !"
          }
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
    if (!isLoadingMore || !hasMorePages || products.length === 0) return null;

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

    if (products.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={products.filter(item => item && item.id)} // Filter out invalid items
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
          removeClippedSubviews={true} // Improve performance
          maxToRenderPerBatch={10} // Render in smaller batches
          windowSize={10} // Keep fewer items in memory
        />
      </View>
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
      <View style={{ flex: 1 }}>
        {renderCategoryFilter()}
        {renderContent()}
      </View>
    </PageContainer>
  );
};

export default PromotionsPresenter; 