import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { FontAwesome6 } from "@expo/vector-icons";
import { ProductBasicDto } from "src/types/Product";
import { SearchFilter } from "src/navigation/types";
import ProductItem from "src/components/ProductItem/ProductItem";
import FilterModal from "src/components/Search/FilterModal/FilterModal";

interface Category {
  id: number;
  name: string;
}

interface Mark {
  id: number;
  name: string;
}

interface OnSearchSectionPresenterProps {
  searchQuery: string;
  filter: SearchFilter;
  searchResults: ProductBasicDto[];
  isLoadingResults: boolean;
  resultsError: string | null;
  hasSearched: boolean;
  isFilterModalOpen: boolean;
  // Pre-loaded filter data
  categories: Category[];
  marks: Mark[];
  isLoadingFilterData: boolean;

  onRetrySearch: () => void;
  onClearSearch: () => void;
  onBackToTyping: () => void;
  onFilterPress: () => void;
  onFilterModalClose: () => void;
  onApplyFilter: (filter: SearchFilter) => void;
  onClearIndividualFilter: (filterType: 'category' | 'mark' | 'price' | 'promotion') => void;
  onClearAllFilters: () => void;
  // Animation props
  clearIconScale: Animated.Value;
  onClearPressIn: () => void;
  onClearPressOut: () => void;
}

/**
 * Presenter component for OnSearchSection
 * Clean, modern UI optimized for Android performance
 */
const OnSearchSectionPresenter: React.FC<OnSearchSectionPresenterProps> = ({
  searchQuery,
  filter,
  searchResults,
  isLoadingResults,
  resultsError,
  hasSearched,
  isFilterModalOpen,
  // Pre-loaded filter data
  categories,
  marks,
  isLoadingFilterData,

  onRetrySearch,
  onClearSearch,
  onBackToTyping,
  onFilterPress,
  onFilterModalClose,
  onApplyFilter,
  onClearIndividualFilter,
  onClearAllFilters,
  // Animation props
  clearIconScale,
  onClearPressIn,
  onClearPressOut,
}) => {
  const colors = useColors();

  // Count active filters for the filter button indicator
  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.categoryId) count++;
    if (filter.markId) count++;
    if (filter.minPrice || filter.maxPrice) count++;
    if (filter.inPromotion) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: ms(24),
      paddingTop: ms(16),
      paddingBottom: ms(20),
      borderBottomWidth: 1,
      borderBottomColor: colors.primary[200],
    },

    searchInfo: {
      backgroundColor: colors.primary[50],
      paddingHorizontal: ms(14),
      paddingVertical: ms(12),
      borderRadius: ms(12),
      borderWidth: 1.5,
      borderColor: colors.primary[300],
    },
    searchInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },

    searchQuery: {
      fontSize: ms(14),
      color: colors.text,
      fontWeight: "500",
      flex: 1,
    },
    filterChip: {
      backgroundColor: colors.primary[100],
      paddingHorizontal: ms(12),
      paddingVertical: ms(6),
      borderRadius: ms(16),
      marginLeft: ms(8),
      borderWidth: 1,
      borderColor: colors.primary[300],
    },
    filterText: {
      fontSize: ms(11),
      color: colors.primary[700],
      fontWeight: "600",
    },
    resultsContainer: {
      flex: 1,
    },
    resultsHeader: {
      paddingHorizontal: ms(24),
      paddingVertical: ms(20),
      backgroundColor: colors.background,
    },
    resultsCount: {
      fontSize: ms(16),
      color: colors.text,
      fontWeight: "700",
      marginBottom: ms(4),
    },
    resultsSubtext: {
      fontSize: ms(13),
      color: colors.textSecondary,
      fontWeight: "500",
    },
    productsList: {
      paddingHorizontal: ms(24),
      paddingBottom: ms(24),
    },
    productsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: ms(24),
      paddingBottom: ms(24),
    },
    productItemContainer: {
      width: "48%",
      marginBottom: ms(16),
      borderRadius: ms(16),
      overflow: "hidden",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: ms(80),
      paddingHorizontal: ms(40),
    },
    loadingIcon: {
      backgroundColor: colors.primary[100],
      padding: ms(20),
      borderRadius: ms(30),
      marginBottom: ms(20),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.text,
      marginTop: ms(16),
      fontWeight: "600",
      textAlign: "center",
    },
    loadingSubtext: {
      fontSize: ms(14),
      color: colors.textSecondary,
      marginTop: ms(8),
      textAlign: "center",
      fontWeight: "500",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(40),
      paddingVertical: ms(80),
    },
    errorIcon: {
      backgroundColor: colors.error[100],
      padding: ms(20),
      borderRadius: ms(30),
      marginBottom: ms(20),
    },
    errorText: {
      fontSize: ms(16),
      color: colors.error[700],
      textAlign: "center",
      marginBottom: ms(8),
      fontWeight: "600",
    },
    errorSubtext: {
      fontSize: ms(13),
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: ms(24),
      fontWeight: "500",
    },
    retryButton: {
      backgroundColor: colors.error[500],
      paddingHorizontal: ms(32),
      paddingVertical: ms(14),
      borderRadius: ms(25),
      borderWidth: 1,
      borderColor: colors.error[600],
    },
    retryText: {
      fontSize: ms(14),
      color: colors.error[50],
      fontWeight: "700",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(40),
      paddingVertical: ms(80),
    },
    emptyIcon: {
      backgroundColor: colors.primary[100],
      padding: ms(24),
      borderRadius: ms(35),
      marginBottom: ms(24),
    },
    emptyText: {
      fontSize: ms(18),
      color: colors.text,
      textAlign: "center",
      marginBottom: ms(8),
      fontWeight: "700",
    },
    emptySubtext: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: ms(20),
      fontWeight: "500",
    },
    clearSearchBtn: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      justifyContent: "center",
      paddingHorizontal: ms(12),
      paddingVertical: ms(8),
    },
    clearSearchIcon: {
      padding: ms(6),
      borderRadius: ms(12),
      backgroundColor: colors.primary[100],
    },
    filterButton: {
      marginLeft: ms(12),
      padding: ms(12),
      borderRadius: ms(12),
      backgroundColor: colors.primary[50],
      borderWidth: 1,
      borderColor: colors.primary[300],
      justifyContent: "center",
      alignItems: "center",
    },
    filterButtonContent: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    filterBadge: {
      position: "absolute",
      top: ms(-6),
      right: ms(-6),
      backgroundColor: colors.primary[600],
      borderRadius: ms(8),
      minWidth: ms(16),
      height: ms(16),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(4),
    },
    filterBadgeText: {
      color: colors.surface,
      fontSize: ms(10),
      fontWeight: "600",
      textAlign: "center",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    searchInfoContainer: {
      flex: 1,
    },
  });

  const renderFilterModal = () => {
    return (
      <FilterModal
        isVisible={isFilterModalOpen}
        currentFilter={filter}
        preLoadedCategories={categories}
        preLoadedMarks={marks}
        isLoadingFilterData={isLoadingFilterData}
        onClose={onFilterModalClose}
        onApplyFilter={onApplyFilter}
        onClearIndividualFilter={onClearIndividualFilter}
        onClearAllFilters={onClearAllFilters}
      />
    );
  };

  const renderProductItem = (item: ProductBasicDto, index: number) => {
    return (
      <View key={item.id.toString()} style={dynamicStyles.productItemContainer}>
        <ProductItem
          product={item}
        />
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <View style={dynamicStyles.loadingIcon}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
      <Text style={dynamicStyles.loadingText}>Recherche en cours</Text>
      <Text style={dynamicStyles.loadingSubtext}>
        Nous cherchons les meilleurs résultats pour vous
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={dynamicStyles.errorContainer}>
      <View style={dynamicStyles.errorIcon}>
        <FontAwesome6
          name="triangle-exclamation"
          size={ms(24)}
          color={colors.error[600]}
        />
      </View>
      <Text style={dynamicStyles.errorText}>
        Oups ! Une erreur s'est produite
      </Text>
      <Text style={dynamicStyles.errorSubtext}>
        Nous n'avons pas pu effectuer votre recherche
      </Text>
      <Pressable
        style={({ pressed }) => [
          dynamicStyles.retryButton,
          pressed && { backgroundColor: colors.error[400] },
        ]}
        onPress={onRetrySearch}
      >
        <Text style={dynamicStyles.retryText}>Réessayer</Text>
      </Pressable>
    </View>
  );

  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <View style={dynamicStyles.emptyIcon}>
        <FontAwesome6
          name="magnifying-glass"
          size={ms(28)}
          color={colors.primary[600]}
        />
      </View>
      <Text style={dynamicStyles.emptyText}>Aucun résultat trouvé</Text>
      <Text style={dynamicStyles.emptySubtext}>
        Essayez avec d'autres mots-clés ou{"\n"}modifiez vos filtres de
        recherche
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoadingResults) {
      return renderLoadingState();
    }

    if (resultsError) {
      return renderErrorState();
    }

    if (hasSearched && searchResults.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView
        style={dynamicStyles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        {searchResults.length > 0 && (
          <View style={dynamicStyles.resultsHeader}>
            <Text style={dynamicStyles.resultsCount}>
              {searchResults.length} résultat
              {searchResults.length > 1 ? "s" : ""}
            </Text>
            <Text style={dynamicStyles.resultsSubtext}>
              Trouvé{searchResults.length > 1 ? "s" : ""} pour votre recherche
            </Text>
          </View>
        )}
        <View style={dynamicStyles.productsContainer}>
          {searchResults.map((product, index) =>
            renderProductItem(product, index)
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerRow}>
          <View style={dynamicStyles.searchInfoContainer}>
            <Pressable
              style={({ pressed }) => [
                dynamicStyles.searchInfo,
                pressed && { backgroundColor: colors.primary[100] },
              ]}
              onPress={onBackToTyping}
            >
              <View style={dynamicStyles.searchInfoRow}>
                <FontAwesome6
                  name="magnifying-glass"
                  size={ms(16)}
                  color={colors.primary[600]}
                  style={{ marginRight: ms(10) }}
                />
                <Text style={dynamicStyles.searchQuery}>{searchQuery}</Text>
              </View>
            </Pressable>
          </View>

          {/* Filter Button (3 dots) */}
          <Pressable
            style={({ pressed }) => [
              dynamicStyles.filterButton,
              pressed && { backgroundColor: colors.primary[100] },
            ]}
            onPress={onFilterPress}
          >
            <View style={dynamicStyles.filterButtonContent}>
              <FontAwesome6
                name="ellipsis-vertical"
                size={ms(18)}
                color={colors.primary[600]}
              />
              {activeFilterCount > 0 && (
                <View style={dynamicStyles.filterBadge}>
                  <Text style={dynamicStyles.filterBadgeText}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Filter Modal */}
      {renderFilterModal()}
    </View>
  );
};

export default OnSearchSectionPresenter;
