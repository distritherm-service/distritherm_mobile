import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ms } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { useColors } from 'src/hooks/useColors';
import { ProductBasicDto } from 'src/types/Product';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import ProductItem from 'src/components/ProductItem/ProductItem';

const { width: screenWidth } = Dimensions.get('window');

interface ProductSimilarPresenterProps {
  similarProducts: ProductBasicDto[];
  loading: boolean;
  error: string | null;
  onProductPress: (productId: number) => void;
  onSeeAllPress: () => void;
  onRetry: () => void;
}

const ProductSimilarPresenter: React.FC<ProductSimilarPresenterProps> = ({
  similarProducts,
  loading,
  error,
  onProductPress,
  onSeeAllPress,
  onRetry,
}) => {
  const colors = useColors();

  // Calculate item width for responsive design using react-native-size-matters
  const itemWidth = ms(160);
  const itemMargin = ms(12);

  const renderSimilarProduct = ({ item }: { item: ProductBasicDto }) => {
    return (
      <View style={styles.productItemWrapper}>
        <ProductItem
          product={item}
          onProductPress={onProductPress}
        />
      </View>
    );
  };

  const renderLoadingItem = () => (
    <View style={[styles.loadingCard, { backgroundColor: colors.surface }]}>
      <ActivityIndicator size="small" color={colors.tertiary[400]} />
    </View>
  );

  const renderErrorState = () => (
    <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        size={ms(24)} // Using react-native-size-matters for responsive design
        color={colors.error[500]}
      />
      <Text style={[styles.errorTitle, { color: colors.text }]}>
        Erreur de chargement
      </Text>
      <Text style={[styles.errorMessage, { color: colors.tertiary[600] }]}>
        {error}
      </Text>
      <Pressable
        style={[styles.retryButton, { backgroundColor: colors.secondary[500] }]}
        onPress={onRetry}
        android_ripple={{ color: colors.secondary[600] }}
      >
        <FontAwesomeIcon
          icon={faRefresh}
          size={ms(16)} // Using react-native-size-matters for responsive design
          color={colors.surface}
        />
        <Text style={[styles.retryText, { color: colors.surface }]}>
          Réessayer
        </Text>
      </Pressable>
    </View>
  );

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Produits similaires
          </Text>
        </View>
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Produits similaires
        </Text>
        
        {!loading && similarProducts.length > 0 && (
          <Pressable
            style={styles.seeAllButton}
            onPress={onSeeAllPress}
            android_ripple={{ color: colors.tertiary[100] }}
          >
            <Text style={[styles.seeAllText, { color: colors.secondary[600] }]}>
              Voir tout
            </Text>
            <FontAwesomeIcon
              icon={faArrowRight}
              size={ms(14)} // Using react-native-size-matters for responsive design
              color={colors.secondary[600]}
            />
          </Pressable>
        )}
      </View>

      {loading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Array.from({ length: 3 })}
          renderItem={renderLoadingItem}
          keyExtractor={(_, index) => `loading-${index}`}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ width: itemMargin }} />}
        />
      ) : similarProducts.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={similarProducts}
          renderItem={renderSimilarProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ width: itemMargin }} />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyText, { color: colors.tertiary[600] }]}>
            Aucun Produit similaire n'a été trouvé
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductSimilarPresenter;

const styles = StyleSheet.create({
  container: {
    marginVertical: ms(16), // Using react-native-size-matters for responsive design
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design
    marginBottom: ms(12), // Using react-native-size-matters for responsive design
  },
  sectionTitle: {
    fontSize: ms(18), // Using react-native-size-matters for responsive design
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8), // Using react-native-size-matters for responsive design
    paddingVertical: ms(4), // Using react-native-size-matters for responsive design
  },
  seeAllText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    marginRight: ms(4), // Using react-native-size-matters for responsive design
  },
  listContainer: {
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design
  },
  productItemWrapper: {
    width: ms(160), // Using react-native-size-matters for responsive design
  },
  // Loading states
  loadingCard: {
    width: ms(160), // Using react-native-size-matters for responsive design
    height: ms(200), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Error states
  errorContainer: {
    marginHorizontal: ms(16), // Using react-native-size-matters for responsive design
    padding: ms(24), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  errorTitle: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    marginTop: ms(8), // Using react-native-size-matters for responsive design
    marginBottom: ms(4), // Using react-native-size-matters for responsive design
  },
  errorMessage: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    textAlign: 'center',
    marginBottom: ms(16), // Using react-native-size-matters for responsive design
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design
    paddingVertical: ms(8), // Using react-native-size-matters for responsive design
    borderRadius: ms(8), // Using react-native-size-matters for responsive design
  },
  retryText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    marginLeft: ms(8), // Using react-native-size-matters for responsive design
  },
  // Empty state
  emptyContainer: {
    marginHorizontal: ms(16), // Using react-native-size-matters for responsive design
    padding: ms(24), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    textAlign: 'center',
  },
}); 