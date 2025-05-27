import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
} from "react-native";
import React from "react";
import { globalStyles } from "src/utils/globalStyles";
import { colors } from "src/utils/colors";
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
  // Animation props
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  dot1Anim: Animated.Value;
  dot2Anim: Animated.Value;
  dot3Anim: Animated.Value;
}

function RecommandationPresenter({
  products,
  isLoading,
  isLoadingMore,
  error,
  productContainerRef,
  handleContainerLayout,
  fadeAnim,
  scaleAnim,
  pulseAnim,
  dot1Anim,
  dot2Anim,
  dot3Anim,
}: RecommandationPresenterProps) {
  return (
    <View style={[globalStyles.container, { paddingTop: ms(0) }]}>
      <Text style={styles.title}>Nos Recommandations</Text>
      <View style={styles.cardContainer}>
        {isLoading ? (
          <Animated.View 
            style={[
              styles.modernLoadingContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.loadingCard}>
              <Animated.View 
                style={[
                  styles.spinnerContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <ActivityIndicator
                  size="large"
                  color={colors.secondary[400]}
                  style={styles.modernSpinner}
                />
              </Animated.View>
              
              <Text style={styles.loadingText}>Chargement des recommandations...</Text>
            </View>
          </Animated.View>
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
                <ProductItem product={product} />
              </View>
            ))}
            {isLoadingMore && (
              <Animated.View 
                style={[
                  styles.modernLoadingMoreContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <View style={styles.loadingMoreCard}>
                  <Animated.View 
                    style={[
                      styles.miniSpinnerContainer,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  >
                    <ActivityIndicator
                      size="small"
                      color={colors.primary[600]}
                      style={styles.miniSpinner}
                    />
                    <View style={styles.miniSpinnerGlow} />
                  </Animated.View>
                  
                  <Text style={styles.modernLoadingMoreText}>
                    Chargement de nouveaux produits...
                  </Text>
                </View>
              </Animated.View>
            )}
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
  modernLoadingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(20),
  },
  loadingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: ms(12),
    alignItems: "center",
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ms(12),
  },
  modernSpinner: {
    transform: [{ scale: ms(1) }],
  },
  loadingText: {
    fontSize: ms(13),
    color: colors.tertiary[600],
    fontWeight: "500",
    textAlign: "center",
  },
  modernLoadingMoreContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: ms(15),
  },
  loadingMoreCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: ms(16),
    paddingVertical: ms(16),
    paddingHorizontal: ms(24),
    flexDirection: "row",
    gap: ms(10),
    alignItems: "center",
    shadowColor: colors.primary[600],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  miniSpinnerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: ms(12),
  },
  miniSpinner: {
    transform: [{ scale: ms(0.9) }],
  },
  miniSpinnerGlow: {
    position: "absolute",
    width: ms(28),
    height: ms(28),
    borderRadius: ms(16),
    backgroundColor: colors.primary[600],
    opacity: 0.08,
    transform: [{ scale: 1.3 }],
  },
  modernLoadingMoreText: {
    fontSize: ms(14),
    color: colors.primary[700],
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // Styles existants conservés
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: ms(20),
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productWrapper: {
    width: "48%",
    marginBottom: ms(10),
  },
  endOfListContainer: {
    alignItems: "center",
    paddingVertical: ms(20),
    marginTop: ms(10),
  },
  endOfListText: {
    fontSize: ms(14),
    color: colors.tertiary[400],
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
  },
});
