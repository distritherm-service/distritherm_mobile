import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "src/utils/globalStyles";
import colors from "src/utils/colors";
import { ms } from "react-native-size-matters";
import ProductItem from "src/components/ProductItem/ProductItem";
import { ProductBasicDto } from "src/types/Product";

interface RecommandationPresenterProps {
  products: ProductBasicDto[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  productContainerRef: React.RefObject<View | null>;
  handleContainerLayout: () => void;
  initialSkeletons: React.ReactElement[];
  loadMoreSkeletons: React.ReactElement[];
  onProductPress: (productId: number) => void;
}

function RecommandationPresenter({
  products,
  isLoading,
  isLoadingMore,
  error,
  productContainerRef,
  handleContainerLayout,
  initialSkeletons,
  loadMoreSkeletons,
  onProductPress,
}: RecommandationPresenterProps) {
  return (
    <View style={[globalStyles.container, { paddingTop: ms(0) }]}>
      <Text style={styles.title}>Nos Recommandations</Text>

      <View style={styles.cardContainer}>
        {isLoading ? (
          <View style={styles.productsContainer}>{initialSkeletons}</View>
        ) : error || products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              {error || "Aucune recommandation disponible"}
            </Text>
          </View>
        ) : (
          <View
            style={styles.productsContainer}
            ref={productContainerRef}
            onLayout={handleContainerLayout}
          >
            {products.map((product, index) => (
              <View key={product.id || index} style={styles.productWrapper}>
                <ProductItem
                  product={product}
                  onProductPress={onProductPress}
                />
              </View>
            ))}
            {isLoadingMore && loadMoreSkeletons}
          </View>
        )}
      </View>
    </View>
  );
}

export default RecommandationPresenter;

const styles = StyleSheet.create({
  title: {
    fontSize: ms(18),
    fontWeight: "700",
    color: colors.primary[800],
    marginBottom: ms(10),
    marginTop: ms(10),
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    marginBottom: ms(20),
  },
  // Styles pour les états vides et erreurs
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(40),
  },
  emptyIcon: {
    fontSize: ms(48),
    marginBottom: ms(16),
  },
  emptyText: {
    fontSize: ms(16),
    color: colors.tertiary[500],
    textAlign: "center",
    lineHeight: ms(22),
  },
  // Styles pour les produits
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productWrapper: {
    width: "48%",
    marginBottom: ms(10),
  },
});
