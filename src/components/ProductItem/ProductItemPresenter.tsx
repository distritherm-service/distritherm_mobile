import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

interface ProductItemPresenterProps {
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
  onPress: () => void;
}

const ProductItemPresenter: React.FC<ProductItemPresenterProps> = ({
  name,
  category,
  price,
  unit,
  imageUrl,
  inStock,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
        <View style={[styles.stockIndicator, { backgroundColor: inStock ? '#4CAF50' : '#F44336' }]} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {price.toFixed(2)} €
          </Text>
          <Text style={styles.unit}>/ {unit}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.stockStatus, { color: inStock ? '#4CAF50' : '#F44336' }]}>
            {inStock ? 'En stock' : 'Rupture'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItemPresenter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  stockIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  unit: {
    fontSize: 14,
    color: '#95A5A6',
    marginLeft: 4,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
