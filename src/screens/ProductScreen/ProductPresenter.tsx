import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductImages from "src/components/Product/ProductImages/ProductImages";
import ProductMainInfo from "src/components/Product/ProductMainInfo/ProductMainInfo";
import ProductDescription from "src/components/Product/ProductDescription/ProductDescription";
import ProductSimilar from "src/components/Product/ProductSimilar/ProductSimilar";
import AuthRequiredModal from "src/components/AuthRequiredModal/AuthRequiredModal";
import { useColors } from "src/hooks/useColors";
import { ProductDetailDto } from "src/types/Product";

interface ProductPresenterProps {
  product: ProductDetailDto | null;
  loading: boolean;
  onBack: () => void;
  onSimilarProductSelect: (productId: number) => Promise<void>;
  onAddToCart: (quantity: number) => Promise<void>;
  addToCartLoading: boolean;
  showAuthModal: boolean;
  onCloseAuthModal: () => void;
}

const fakeImages = [
  "https://www.airchaud-diffusion.fr/medias/images/produits/climatiseur-mobile-split-c15000n-echangeur-deconnectable-inverter-gaz-r32-rexair-re-c15000n-re-c15000n-0d-01450-rsp.jpg?v=1722539071",
  "https://media.gqmagazine.fr/photos/6787a164a446b37cedb84437/16:9/w_2560%2Cc_limit/Renault5.jpg",
  "https://www.smbois.com/_next/image?url=https%3A%2F%2Fapi.smbois.com%2Fmedia%2Fcatalog%2Fproduct%2Fc%2Fo%2Fcontreplaque-bouleau-50mm.jpg%3Fstore%3Ddefault%26image-type%3Dimage&w=1920&q=52",
  "https://www.fitandrack.com/web/image/product.template/127/image_1024?unique=3668cc9",
];

const ProductPresenter: React.FC<ProductPresenterProps> = ({
  product,
  loading,
  onBack,
  onSimilarProductSelect,
  onAddToCart,
  addToCartLoading,
  showAuthModal,
  onCloseAuthModal,
}) => {
  const colors = useColors();

  // Enhanced loading state UI with tertiary colors
  if (loading) {
    return (
      <PageContainer
        bottomBar={false}
        headerBack={true}
        headerTitle="Chargement..."
        onCustomBack={onBack}
        titleLeft={true}
        isScrollable={true}
      >
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.loadingCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.tertiary[100],
              },
            ]}
          >
            <View
              style={[
                styles.loadingIconContainer,
                {
                  backgroundColor: colors.secondary[50],
                  borderColor: colors.tertiary[200],
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.secondary[500]} />
            </View>
            <Text style={[styles.loadingTitle, { color: colors.text }]}>
              Chargement du produit...
            </Text>
            <Text
              style={[styles.loadingSubtitle, { color: colors.tertiary[600] }]}
            >
              Veuillez patienter quelques instants
            </Text>
          </View>
        </View>
      </PageContainer>
    );
  }

  // Main content when data is loaded with enhanced styling
  return (
    <PageContainer
      bottomBar={false}
      headerBack={true}
      headerTitle={product?.name || "Détail du produit"}
      onCustomBack={onBack}
      titleLeft={true}
      isScrollable={true}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Enhanced content wrapper with subtle tertiary styling */}
        <View style={styles.contentWrapper}>
          <ProductImages images={product?.imagesUrl} />
          {product && (
            <ProductMainInfo 
              product={product} 
              onAddToCart={onAddToCart}
              addToCartLoading={addToCartLoading}
            />
          )}
          {product && <ProductDescription product={product} />}
          {product && (
            <ProductSimilar
              currentProductId={product.id}
              categoryId={product.categoryId}
              markId={product.markId}
              onProductSelect={onSimilarProductSelect}
            />
          )}
        </View>

        {/* Enhanced bottom spacing with subtle gradient effect */}
        <View
          style={[styles.bottomSpacer, { backgroundColor: colors.background }]}
        />
      </View>

      {/* Authentication Required Modal */}
      <AuthRequiredModal
        visible={showAuthModal}
        onClose={onCloseAuthModal}
        title="Connexion requise"
        message="Vous devez être connecté pour ajouter des produits au panier."
      />
    </PageContainer>
  );
};

export default ProductPresenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: ms(8), // Using react-native-size-matters for responsive design
  },
  contentWrapper: {
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(24), // Using react-native-size-matters for responsive design
    paddingVertical: ms(40), // Using react-native-size-matters for responsive design
  },
  loadingCard: {
    paddingHorizontal: ms(32), // Using react-native-size-matters for responsive design
    paddingVertical: ms(40), // Using react-native-size-matters for responsive design
    borderRadius: ms(24), // Using react-native-size-matters for responsive design
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxWidth: ms(320), // Using react-native-size-matters for responsive design
    width: "100%",
    borderWidth: 1,
  },
  loadingIconContainer: {
    marginBottom: ms(24), // Using react-native-size-matters for responsive design
    padding: ms(16), // Using react-native-size-matters for responsive design
    borderRadius: ms(50), // Using react-native-size-matters for responsive design
    borderWidth: 1,
  },
  loadingTitle: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design
    fontWeight: "700",
    textAlign: "center",
    marginBottom: ms(8), // Using react-native-size-matters for responsive design
  },
  loadingSubtitle: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: "500",
    textAlign: "center",
    lineHeight: ms(20), // Using react-native-size-matters for responsive design
  },
  bottomSpacer: {
    height: ms(24), // Using react-native-size-matters for responsive design
  },
});
