import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import PageContainer from "src/components/PageContainer/PageContainer";
import ProductImages from "src/components/Product/ProductImages/ProductImages";
import { useColors } from "src/hooks/useColors";
import { ProductDetail } from "src/types/Product";
import colors from "src/utils/colors";

interface ProductPresenterProps {
  product: ProductDetail | null;
  loading: boolean;
  onBack: () => void;
}

const fakeImages = [
  "https://www.airchaud-diffusion.fr/medias/images/produits/climatiseur-mobile-split-c15000n-echangeur-deconnectable-inverter-gaz-r32-rexair-re-c15000n-re-c15000n-0d-01450-rsp.jpg?v=1722539071",
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.smbois.com%2Fp%2Fcontreplaque-bouleau-50mm&psig=AOvVaw3Ix6AZ9PGeM6CrvIQ3O9eo&ust=1749723780020000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICytJST6Y0DFQAAAAAdAAAAABAE",
  "https://www.fitandrack.com/web/image/product.template/127/image_1024?unique=3668cc9",
];

const ProductPresenter: React.FC<ProductPresenterProps> = ({
  product,
  loading,
  onBack,
}) => {
  // Loading state UI
  if (loading) {
    return (
      <PageContainer
        headerBack={true}
        headerTitle="Chargement..."
        onCustomBack={onBack}
        titleLeft={true}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary[500]} />
        </View>
      </PageContainer>
    );
  }

  // Main content when data is loaded

  return (
    <PageContainer
      headerBack={true}
      headerTitle={product?.name || "Détail du produit"}
      onCustomBack={onBack}
      titleLeft={true}
    >
      <View style={styles.container}>
        <ProductImages images={fakeImages} />
      </View>
    </PageContainer>
  );
};

export default ProductPresenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
