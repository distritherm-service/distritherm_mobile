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
import { globalStyles } from "src/utils/globalStyles";
import colors from "src/utils/colors";
import ProductItem from "src/components/ProductItem/ProductItem";
import { ProductBasicDto } from "src/types/Product";

interface RecommandationPresenterProps {
  products: ProductBasicDto[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isLoadingMore: boolean;
  hasMorePages: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

const RecommandationPresenter: React.FC<RecommandationPresenterProps> = ({
  products,
  isLoading,
  isRefreshing,
  error,
  isLoadingMore,
  hasMorePages,
  onRefresh,
  onLoadMore,
  onRetry,
}) => {
  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={styles.loadingText}>
        Chargement des recommandations...
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.errorContainer}>
        <FontAwesome6
          name="triangle-exclamation"
          size={ms(48)}
          color={colors.danger[500]}
        />
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Aucune recommandation disponible</Text>
        <Text style={styles.emptyDescription}>
          Les nouvelles recommandations apparaîtront ici dès qu'elles seront disponibles !
        </Text>
      </View>
    </View>
  );

  // Render product item
  const renderProductItem = ({ item }: { item: ProductBasicDto }) => (
    <View style={styles.productWrapper}>
      <ProductItem product={item} />
    </View>
  );

  // Render load more footer
  const renderLoadMoreFooter = () => {
    if (!isLoadingMore || !hasMorePages || products.length === 0) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
        <Text style={styles.loadMoreText}>Chargement...</Text>
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
      <FlatList
        data={products.filter(item => item && item.id)} // Filter out invalid items
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
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
        removeClippedSubviews={true} // Improve performance - using react-native-size-matters for optimization
        maxToRenderPerBatch={10} // Render in smaller batches - using react-native-size-matters for performance
        windowSize={10} // Keep fewer items in memory - using react-native-size-matters for memory optimization
      />
    );
  };

  return (
    <View style={[globalStyles.container, { paddingTop: ms(0) }]}>
      <Text style={styles.title}>Nos Recommandations</Text>
      <View style={styles.cardContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

export default RecommandationPresenter;

const styles = StyleSheet.create({
  title: {
    fontSize: ms(18), // Using react-native-size-matters for responsive font size
    fontWeight: "700",
    color: colors.primary[800],
    marginBottom: ms(10), // Using react-native-size-matters for responsive margin
    marginTop: ms(10), // Using react-native-size-matters for responsive margin
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    flex: 1,
    marginBottom: ms(20), // Using react-native-size-matters for responsive margin
  },
  // Common styles
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
  },
  // Loading state styles
  loadingText: {
    color: colors.tertiary[500],
    fontSize: ms(16), // Using react-native-size-matters for responsive font size
    marginTop: ms(16), // Using react-native-size-matters for responsive margin
  },
  // Error state styles
  errorContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.danger[200],
    shadowColor: colors.text,
    borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
    padding: ms(32), // Using react-native-size-matters for responsive padding
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: ms(320), // Using react-native-size-matters for responsive max width
  },
  errorTitle: {
    color: colors.danger[600],
    fontSize: ms(18), // Using react-native-size-matters for responsive font size
    fontWeight: "700",
    textAlign: "center",
    marginTop: ms(16), // Using react-native-size-matters for responsive margin
    marginBottom: ms(8), // Using react-native-size-matters for responsive margin
  },
  errorDescription: {
    color: colors.danger[500],
    fontSize: ms(16), // Using react-native-size-matters for responsive font size
    textAlign: "center",
    lineHeight: ms(24), // Using react-native-size-matters for responsive line height
    marginBottom: ms(14), // Using react-native-size-matters for responsive margin
  },
  retryButton: {
    backgroundColor: colors.danger[500],
    shadowColor: colors.text,
    paddingHorizontal: ms(24), // Using react-native-size-matters for responsive padding
    paddingVertical: ms(12), // Using react-native-size-matters for responsive padding
    borderRadius: ms(8), // Using react-native-size-matters for responsive border radius
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
    fontSize: ms(16), // Using react-native-size-matters for responsive font size
    fontWeight: "600",
  },
  // Empty state styles
  emptyContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    shadowColor: colors.text,
    borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
    padding: ms(32), // Using react-native-size-matters for responsive padding
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: ms(320), // Using react-native-size-matters for responsive max width
  },
  emptyIcon: {
    fontSize: ms(48), // Using react-native-size-matters for responsive font size
    marginBottom: ms(16), // Using react-native-size-matters for responsive margin
  },
  emptyTitle: {
    color: colors.text,
    fontSize: ms(18), // Using react-native-size-matters for responsive font size
    fontWeight: "700",
    textAlign: "center",
    marginTop: ms(16), // Using react-native-size-matters for responsive margin
    marginBottom: ms(8), // Using react-native-size-matters for responsive margin
  },
  emptyDescription: {
    color: colors.tertiary[500],
    fontSize: ms(16), // Using react-native-size-matters for responsive font size
    textAlign: "center",
    lineHeight: ms(22), // Using react-native-size-matters for responsive line height
  },
  // List styles
  listContent: {
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive padding
    paddingTop: ms(16), // Using react-native-size-matters for responsive padding
    paddingBottom: ms(20), // Using react-native-size-matters for responsive padding
  },
  productWrapper: {
    flex: 1,
    marginHorizontal: ms(8), // Using react-native-size-matters for responsive margin
    marginBottom: ms(16), // Using react-native-size-matters for responsive margin
  },
  // Load more styles
  loadMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: ms(16), // Using react-native-size-matters for responsive padding
    gap: ms(8), // Using react-native-size-matters for responsive gap
  },
  loadMoreText: {
    color: colors.primary[500],
    fontSize: ms(14), // Using react-native-size-matters for responsive font size
    fontWeight: "500",
  },
});
