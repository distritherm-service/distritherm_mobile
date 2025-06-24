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
  Animated,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductItem from "src/components/ProductItem/ProductItem";
import Input from "src/components/Input/Input";
import EmptyState from "src/components/EmptyState/EmptyState";
import { InputType } from "src/types/InputType";
import { useColors } from "src/hooks/useColors";
import { PromotionDto } from "src/services/promotionsService";
import { ProductBasicDto } from "src/types/Product";
import { Category } from "src/types/Category";
import { SelectOption } from "src/components/Input/Input";
import { Dimensions } from "react-native";
import { faTags } from "@fortawesome/free-solid-svg-icons";

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
  selectedCategoryOption: SelectOption | undefined;
  categoryOptions: SelectOption[];
  isCategoriesLoading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onNavigateBack: () => void;
  onCategorySelect: (option: SelectOption) => void;
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
  selectedCategoryOption,
  categoryOptions,
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
    headerGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: ms(16), // Using react-native-size-matters - increased gap for better spacing
      zIndex: 1, // Ensure content appears above gradient
    },
    headerIconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: colors.primary[300],
      width: ms(44), // Using react-native-size-matters - increased size for better touch target
      height: ms(44), // Using react-native-size-matters - increased size for better touch target
      borderRadius: ms(22),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      shadowColor: colors.primary[500],
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    headerTitle: {
      color: colors.text,
      fontSize: ms(22), // Using react-native-size-matters - increased for better visual hierarchy
      fontWeight: "800",
      flex: 1,
      letterSpacing: 0.5, // Added letter spacing for premium feel
    },
    headerCount: {
      backgroundColor: colors.primary[500],
      minWidth: ms(36), // Using react-native-size-matters - increased for better visual presence
      height: ms(36), // Using react-native-size-matters - increased for better visual presence
      borderRadius: ms(18),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(10), // Using react-native-size-matters - increased padding
      shadowColor: colors.primary[500],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    headerCountText: {
      color: colors.surface,
      fontSize: ms(14),
      fontWeight: "700",
    },
    // Common styles
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(20),
    },
    // Loading state styles with gradient background
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(20),
    },
    loadingGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    loadingContent: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: ms(20),
      padding: ms(32),
      shadowColor: colors.primary[500],
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    loadingText: {
      color: colors.text,
      fontSize: ms(16),
      fontWeight: "600",
      marginTop: ms(16),
      textAlign: "center",
    },
    // Error state styles with enhanced visual design
    errorContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: colors.danger[300],
      shadowColor: colors.danger[500],
      borderRadius: ms(20),
      padding: ms(36), // Using react-native-size-matters - increased padding for better visual appeal
      alignItems: "center",
      borderWidth: 1.5,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
      maxWidth: ms(340), // Using react-native-size-matters - increased width for better content display
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
      shadowColor: colors.danger[500],
      paddingHorizontal: ms(28), // Using react-native-size-matters - increased padding for better touch target
      paddingVertical: ms(14), // Using react-native-size-matters - increased padding for better touch target
      borderRadius: ms(12), // Using react-native-size-matters - increased border radius for modern look
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    retryButtonPressed: {
      backgroundColor: colors.danger[600],
    },
    retryButtonText: {
      color: colors.surface,
      fontSize: ms(16),
      fontWeight: "600",
    },

    // Enhanced list styles for better UI/UX
    listContent: {
      paddingHorizontal: ms(10), // Using react-native-size-matters - optimized padding
      paddingTop: ms(20), // Using react-native-size-matters - increased top padding for better visual separation
      paddingBottom: ms(28), // Using react-native-size-matters - increased bottom padding for better scroll experience
    },
    promotionItemStyle: {
      flex: 1,
      marginHorizontal: ms(8), // Using react-native-size-matters - reduced for better grid layout
      marginBottom: ms(18), // Using react-native-size-matters - increased spacing between rows
      borderRadius: ms(16), // Using react-native-size-matters - maintained modern border radius
      overflow: "hidden",
    },
    // Enhanced list container with gradient background
    listContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listGradientBackground: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
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

    // Beautiful minimalist category filter with intelligent layout
    categoryFilterContainer: {
      backgroundColor: colors.secondary[50], // Clean white background
      borderBottomColor: colors.secondary[100],
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(16), // Using react-native-size-matters - slightly increased for better spacing
      borderBottomWidth: 1,
      flexDirection: "column",
      gap: ms(5),
    },
    categoryFilterHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: ms(12), // Using react-native-size-matters - spacing before input
    },
    categoryFilterTitleSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: ms(10), // Using react-native-size-matters - spacing between icon and title
    },
    categoryFilterIcon: {
      backgroundColor: colors.secondary[400], // 60% - Secondary color for icon
      width: ms(32), // Using react-native-size-matters - slightly larger for better visual balance
      height: ms(32), // Using react-native-size-matters - slightly larger for better visual balance
      borderRadius: ms(16),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.secondary[500],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    categoryFilterTitle: {
      color: colors.tertiary[500], // 30% - Tertiary color for main text
      fontSize: ms(16), // Using react-native-size-matters - clean, readable size
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    categoryFilterBadge: {
      backgroundColor: colors.secondary[500], // 60% - Secondary color for badge
      paddingHorizontal: ms(12), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(6), // Using react-native-size-matters for responsive padding
      borderRadius: ms(16),
      shadowColor: colors.secondary[500],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      minWidth: ms(50), // Using react-native-size-matters - ensure minimum width
      alignItems: "center",
    },
    categoryFilterBadgeText: {
      color: colors.surface, // White text on secondary background
      fontSize: ms(13), // Using react-native-size-matters for responsive font size
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    categoryFilterInputContainer: {
      flexGrow: 1,
    },
    categoryLoadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: ms(8), // Using react-native-size-matters for spacing
    },
    categoryLoadingText: {
      color: colors.secondary[600], // 60% - Secondary color for loading text
      fontSize: ms(13), // Using react-native-size-matters - compact font size
      fontWeight: "500",
    },
  });

  // Render beautiful and intelligent category filter with visible promotion count
  const renderCategoryFilter = () => {
    if (isCategoriesLoading) {
      return (
        <View style={dynamicStyles.categoryFilterContainer}>
          <View style={dynamicStyles.categoryFilterHeader}>
            <View style={dynamicStyles.categoryFilterTitleSection}>
              <View style={dynamicStyles.categoryFilterIcon}>
                <FontAwesome6
                  name="filter"
                  size={ms(15)} // Using react-native-size-matters for responsive icon size
                  color={colors.surface} // White icon on secondary background
                />
              </View>
              <Text style={dynamicStyles.categoryFilterTitle}>
                Filtrer par catégorie
              </Text>
            </View>
            <View style={dynamicStyles.categoryLoadingContainer}>
              <ActivityIndicator size="small" color={colors.secondary[500]} />
              <Text style={dynamicStyles.categoryLoadingText}>
                Chargement...
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (categoryOptions.length === 0) {
      return null;
    }

    return (
      <View style={dynamicStyles.categoryFilterContainer}>
        <View style={dynamicStyles.categoryFilterHeader}>
          <View style={dynamicStyles.categoryFilterTitleSection}>
            <View style={dynamicStyles.categoryFilterIcon}>
              <FontAwesome6
                name="filter"
                size={ms(15)}
                color={colors.surface}
              />
            </View>
            <Text style={dynamicStyles.categoryFilterTitle}>
              Filtrer par catégorie
            </Text>
          </View>
          {promotionsCount > 0 && (
            <View style={dynamicStyles.categoryFilterBadge}>
              <Text style={dynamicStyles.categoryFilterBadgeText}>
                {promotionsCount}
              </Text>
            </View>
          )}
        </View>

        <View style={dynamicStyles.categoryFilterInputContainer}>
          <Input
            name="category"
            type={InputType.SEARCHABLE_SELECT}
            placeholder="Sélectionner une catégorie"
            searchPlaceholder="Rechercher une catégorie..."
            options={categoryOptions}
            selectedOption={selectedCategoryOption}
            onSelectOption={onCategorySelect}
            style={{ marginVertical: ms(40) }}
          />
        </View>
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

  // Render empty state using shared EmptyState component
  const renderEmptyState = () => (
    <EmptyState
      icon={faTags}
      title={
        selectedCategoryId
          ? "Aucune promotion dans cette catégorie"
          : "Aucune promotion disponible"
      }
      description={
        selectedCategoryId
          ? "Essayez de sélectionner une autre catégorie ou consultez toutes les promotions."
          : "Les nouvelles promotions apparaîtront ici dès qu'elles seront disponibles !"
      }
      iconColor="primary"
      variant="gradient"
    />
  );

  // Render product item
  const renderProductItem = ({ item }: { item: ProductBasicDto }) => (
    <View style={dynamicStyles.promotionItemStyle}>
      <ProductItem product={item} />
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
      <View style={dynamicStyles.listContainer}>
        <FlatList
          data={products.filter((item) => item && item.id)} // Filter out invalid items
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={dynamicStyles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.secondary[500], colors.secondary[600]]} // Using secondary colors for consistency
              tintColor={colors.secondary[500]}
              progressBackgroundColor={colors.surface}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderLoadMoreFooter}
          removeClippedSubviews={true} // Improve performance
          maxToRenderPerBatch={8} // Optimized for better performance
          windowSize={8} // Optimized memory usage
          ItemSeparatorComponent={() => <View style={{ height: ms(2) }} />} // Minimal separator for better visual spacing
          getItemLayout={(data, index) => ({
            // Optimize scrolling performance
            length: ms(220), // Estimated item height
            offset: ms(220) * Math.floor(index / 2), // Account for 2 columns
            index,
          })}
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
