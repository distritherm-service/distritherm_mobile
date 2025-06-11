import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ms, s, vs } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { ProductDetailDto } from 'src/types/Product';
import { useColors } from 'src/hooks/useColors';

interface ProductDetail {
  label: string;
  value: string;
}

interface ProductDescriptionPresenterProps {
  product: ProductDetailDto;
  activeTab: 'description' | 'details';
  hasDescription: boolean;
  hasDetails: boolean;
  productDetails: ProductDetail[];
  onTabChange: (tab: 'description' | 'details') => void;
}

const ProductDescriptionPresenter: React.FC<ProductDescriptionPresenterProps> = ({
  product,
  activeTab,
  hasDescription,
  hasDetails,
  productDetails,
  onTabChange,
}) => {
  const colors = useColors();

  const renderTabButton = (tab: 'description' | 'details', label: string) => {
    const isActive = activeTab === tab;
    
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          {
            backgroundColor: isActive ? colors.secondary[400] : colors.primary[100],
            borderColor: isActive ? colors.secondary[400] : colors.border,
          },
        ]}
        onPress={() => onTabChange(tab)}
      >
        <Text
          style={[
            styles.tabText,
            { color: isActive ? colors.primary[50] : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDescription = () => {
    if (!hasDescription) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Aucune description disponible pour ce produit.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.descriptionText, { color: colors.text }]}>
          {product.description}
        </Text>
      </ScrollView>
    );
  };

  const renderDetails = () => {
    if (!hasDetails) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Aucun détail disponible pour ce produit.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsList}>
          {productDetails.map((detail, index) => (
            <View 
              key={index} 
              style={[
                styles.detailItem,
                { borderBottomColor: colors.border },
                index === productDetails.length - 1 && styles.lastDetailItem,
              ]}
            >
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                {detail.label}
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
                {detail.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return renderDescription();
      case 'details':
        return renderDetails();
      default:
        return renderDescription();
    }
  };

  // If neither description nor details are available, show a message
  if (!hasDescription && !hasDetails) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Aucune information supplémentaire disponible pour ce produit.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Section Title */}
      <View style={styles.headerSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Informations produit
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {hasDescription && renderTabButton('description', 'Description')}
        {hasDetails && renderTabButton('details', 'Détails techniques')}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(16), // Using react-native-size-matters for responsive design
    marginVertical: vs(8), // Using react-native-size-matters for responsive design
    borderRadius: ms(12), // Using react-native-size-matters for responsive design
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerSection: {
    paddingHorizontal: s(20), // Using react-native-size-matters for responsive design
    paddingTop: vs(20), // Using react-native-size-matters for responsive design
    paddingBottom: vs(16), // Using react-native-size-matters for responsive design
  },
  sectionTitle: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: s(20), // Using react-native-size-matters for responsive design
    marginBottom: vs(16), // Using react-native-size-matters for responsive design
    gap: s(12), // Using react-native-size-matters for responsive design
  },
  tabButton: {
    paddingHorizontal: s(16), // Using react-native-size-matters for responsive design
    paddingVertical: vs(10), // Using react-native-size-matters for responsive design
    borderRadius: ms(20), // Using react-native-size-matters for responsive design
    borderWidth: 1,
    minWidth: s(120), // Using react-native-size-matters for responsive design
    alignItems: 'center',
  },
  tabText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: s(20), // Using react-native-size-matters for responsive design
    paddingBottom: vs(20), // Using react-native-size-matters for responsive design
    minHeight: vs(200), // Using react-native-size-matters for responsive design
  },
  contentScrollView: {
    maxHeight: vs(300), // Using react-native-size-matters for responsive design
  },
  descriptionText: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    lineHeight: ms(24), // Using react-native-size-matters for responsive design
    fontWeight: '400',
    textAlign: 'justify',
  },
  detailsList: {
    gap: vs(0), // Using react-native-size-matters for responsive design
  },
  detailItem: {
    paddingVertical: vs(12), // Using react-native-size-matters for responsive design
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastDetailItem: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '500',
    flex: 1,
    marginRight: s(12), // Using react-native-size-matters for responsive design
  },
  detailValue: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  emptyState: {
    paddingVertical: vs(40), // Using react-native-size-matters for responsive design
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: ms(22), // Using react-native-size-matters for responsive design
  },
});

export default ProductDescriptionPresenter; 