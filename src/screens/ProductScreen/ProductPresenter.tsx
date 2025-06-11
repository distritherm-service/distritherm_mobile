import React from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'src/components/PageContainer/PageContainer';
import { useColors } from 'src/hooks/useColors';
import { ProductData } from './Product';

interface ProductPresenterProps {
  product: ProductData | null;
  loading: boolean;
  onBack: () => void;
}

const ProductPresenter: React.FC<ProductPresenterProps> = ({ 
  product, 
  loading, 
  onBack 
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <PageContainer 
      headerBack={true} 
      headerTitle="Product"
      onCustomBack={onBack}
    >
      <View style={dynamicStyles.container}>
        {/* Content removed */}
      </View>
    </PageContainer>
  );
};

export default ProductPresenter;

const styles = StyleSheet.create({
  // Styles statiques si nécessaire
});