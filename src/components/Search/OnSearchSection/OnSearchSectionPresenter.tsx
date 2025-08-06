import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { FontAwesome6 } from "@expo/vector-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ProductBasicDto } from "src/types/Product";
import { SearchFilter } from "src/navigation/types";
import ProductItem from "src/components/ProductItem/ProductItem";
import FilterModal from "src/components/Search/FilterModal/FilterModal";
import EmptyState from "src/components/EmptyState/EmptyState";

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
  // Scroll and animation props
  isScrollingDown: boolean;
  onScroll: (event: any) => void;
  headerTranslateY: Animated.Value;
  activeFilterCount: number;

  onRetrySearch: () => void;
  onClearSearch: () => void;
  onBackToTyping: () => void;
  onFilterPress: () => void;
  onFilterModalClose: () => void;
  onApplyFilter: (filter: SearchFilter) => void;
  onClearIndividualFilter: (
    filterType: "category" | "mark" | "price"
  ) => void;
  onClearAllFilters: () => void;
  onProductPress: (productId: number) => void;
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
  // Scroll and animation props
  isScrollingDown,
  onScroll,
  headerTranslateY,
  activeFilterCount,

  onRetrySearch,
  onClearSearch,
  onBackToTyping,
  onFilterPress,
  onFilterModalClose,
  onApplyFilter,
  onClearIndividualFilter,
  onClearAllFilters,
  onProductPress,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: colors.secondary[400],
      paddingHorizontal: ms(20),
      paddingBottom: ms(10),
      borderBottomColor: colors.secondary[500],
      paddingTop: ms(10),
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: ms(65),
      flexGrow: 1,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: ms(12),
      borderWidth: 1,
      borderColor: colors.borderDark,
      shadowColor: colors.tertiary[200],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    searchInputContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: ms(16),
      paddingVertical: ms(14),
      borderRadius: ms(16),
      borderWidth: 1,
      borderColor: colors.borderDark,
      shadowColor: colors.tertiary[200],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      marginRight: ms(12),
    },

    searchInputRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    searchQuery: {
      fontSize: ms(15),
      color: colors.text,
      fontWeight: "500",
      flex: 1,
    },

    filterButton: {
      padding: ms(12),
      borderRadius: ms(12),
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderDark,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tertiary[200],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },

    filterButtonContent: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },

    filterBadge: {
      position: "absolute",
      top: ms(-8),
      right: ms(-8),
      backgroundColor: colors.secondary[500],
      borderWidth: 2,
      borderColor: colors.surface,
      borderRadius: ms(10),
      minWidth: ms(20),
      height: ms(20),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(4),
      shadowColor: colors.secondary[400],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },

    filterBadgeText: {
      color: colors.surface,
      fontSize: ms(11),
      fontWeight: "700",
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    filterChip: {
      backgroundColor: colors.surface,
      paddingHorizontal: ms(14),
      paddingVertical: ms(8),
      borderRadius: ms(20),
      marginLeft: ms(8),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.tertiary[200],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    filterText: {
      fontSize: ms(12),
      color: colors.secondary[600],
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
      padding: ms(8),
      borderRadius: ms(16),
      backgroundColor: colors.primary[50],
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
          onPressProduct={() => onProductPress(item.id)}
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
    <EmptyState
      icon={faMagnifyingGlass}
      title="Aucun résultat trouvé"
      description="Essayez avec d'autres mots-clés ou modifiez vos filtres de recherche"
      iconColor="primary"
      variant="default"
    />
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
      <View style={dynamicStyles.resultsContainer}>
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
      </View>
    );
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header sticky */}
      <Animated.View 
        style={[
          dynamicStyles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={dynamicStyles.headerTop}>
          <Pressable
            style={dynamicStyles.backButton}
            onPress={onBackToTyping}
          >
            <FontAwesome6
              name="arrow-left"
              size={ms(18)}
              color={colors.secondary[500]}
            />
          </Pressable>
          <View style={dynamicStyles.searchRow}>
            {/* Search Input Container - Clickable to go back to typing mode */}
            <Pressable
              style={dynamicStyles.searchInputContainer}
              onPress={onBackToTyping}
            >
              <View style={dynamicStyles.searchInputRow}>
                <FontAwesome6
                  name="magnifying-glass"
                  size={ms(16)}
                  color={colors.secondary[500]}
                  style={{ marginRight: ms(10) }}
                />
                <Text style={dynamicStyles.searchQuery}>{searchQuery}</Text>
              </View>
            </Pressable>

            {/* Filter Button */}
            <Pressable
              style={({ pressed }) => [
                dynamicStyles.filterButton,
                pressed && { backgroundColor: colors.primary[50] }, // Using react-native-size-matters - elegant pressed state
              ]}
              onPress={onFilterPress}
            >
              <View style={dynamicStyles.filterButtonContent}>
                <FontAwesome6
                  name="sliders"
                  size={ms(16)} // Using react-native-size-matters - filter icon instead of dots
                  color={colors.secondary[500]}
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
      </Animated.View>

      {/* Contenu scrollable */}
      <ScrollView
        style={dynamicStyles.scrollContainer}
        contentContainerStyle={dynamicStyles.contentContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default OnSearchSectionPresenter;
