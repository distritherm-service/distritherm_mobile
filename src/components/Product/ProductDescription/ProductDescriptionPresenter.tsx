import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ms } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
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

  const renderTabSection = (tab: 'description' | 'details', label: string, icon: string) => {
    const isActive = activeTab === tab;
    
    return (
      <TouchableOpacity
        style={[
          styles.tabSection,
          isActive && [styles.activeTabSection, { borderBottomColor: colors.secondary[500] }],
        ]}
        onPress={() => onTabChange(tab)}
        activeOpacity={0.7}
      >
        <View style={styles.tabSectionContent}>
          <Text style={[styles.tabSectionIcon, { color: isActive ? colors.secondary[500] : colors.textSecondary }]}>
            {icon}
          </Text>
          <Text
            style={[
              styles.tabSectionText,
              { color: isActive ? colors.secondary[500] : colors.textSecondary },
              isActive && styles.activeTabSectionText,
            ]}
          >
            {label}
          </Text>
        </View>

      </TouchableOpacity>
    );
  };

  const renderDescription = () => {
    if (!hasDescription) {
      return (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.secondary[50] }]}>
            <Text style={styles.emptyIcon}>📝</Text>
          </View>
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            Aucune description
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            La description de ce produit n'est pas encore disponible.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.descriptionContainer}>
        <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.descriptionText, { color: colors.text }]}>
            {product.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    if (!hasDetails) {
      return (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.secondary[50] }]}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            Aucun détail technique
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Les spécifications techniques ne sont pas encore disponibles.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.detailsScrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
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
                <View style={styles.detailLabelContainer}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {detail.label}
                  </Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
                    {detail.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.secondary[50] }]}>
            <Text style={styles.emptyIcon}>📄</Text>
          </View>
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            Aucune information disponible
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Les informations détaillées de ce produit ne sont pas encore disponibles.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Enhanced Section Title */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>📋</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations produit
          </Text>
        </View>
        <View style={[styles.titleUnderline, { backgroundColor: colors.secondary[200] }]} />
      </View>

      {/* Enhanced Tab Navigation */}
      <View style={styles.tabContainer}>
        {hasDescription && renderTabSection('description', 'Description', '📝')}
        {hasDetails && renderTabSection('details', 'Spécifications', '⚙️')}
      </View>

      {/* Enhanced Content */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: ms(16), // Using react-native-size-matters for responsive design
    marginVertical: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
    borderRadius: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerSection: {
    paddingHorizontal: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    paddingTop: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    paddingBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
    marginBottom: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
  },
  titleIcon: {
    fontSize: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
  },
  sectionTitle: {
    fontSize: ms(22), // Using react-native-size-matters for responsive design - keeping unchanged as requested
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleUnderline: {
    height: ms(3), // Using react-native-size-matters for responsive design
    width: ms(50), // Using react-native-size-matters for responsive design - reduced from 60
    borderRadius: ms(2), // Using react-native-size-matters for responsive design
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    marginBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
     tabSection: {
     flex: 1,
     paddingVertical: ms(10), // Using react-native-size-matters for responsive design - reduced from 12
     borderBottomWidth: 2,
     borderBottomColor: 'transparent',
     alignItems: 'center',
     justifyContent: 'center',
   },
  activeTabSection: {
    borderBottomWidth: 4,
  },
  tabSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6), // Using react-native-size-matters for responsive design
  },
  tabSectionIcon: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
  },
  tabSectionText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design - keeping unchanged as requested
    fontWeight: '600',
  },
  activeTabSectionText: {
    fontWeight: '700',
  },
  
  contentContainer: {
    paddingHorizontal: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
    paddingBottom: ms(20), // Using react-native-size-matters for responsive design - reduced from 24
  },
  contentCard: {
    borderRadius: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    paddingVertical: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  descriptionContainer: {
    // Container for description - allows content to fit naturally
  },
  descriptionText: {
    fontSize: ms(14), // Using react-native-size-matters for responsive design - reduced from 16
    lineHeight: ms(22), // Using react-native-size-matters for responsive design - reduced from 26
    fontWeight: '400',
    textAlign: 'justify',
  },
  detailsScrollView: {
    maxHeight: ms(350), // Reduced height for more compact appearance - reduced from 400
  },
  detailsList: {
    gap: ms(0), // Using react-native-size-matters for responsive design
  },
  detailItem: {
    paddingVertical: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lastDetailItem: {
    borderBottomWidth: 0,
  },
  detailLabelContainer: {
    flex: 1,
    paddingRight: ms(12), // Using react-native-size-matters for responsive design - reduced from 16
  },
  detailLabel: {
    fontSize: ms(12), // Using react-native-size-matters for responsive design - reduced from 14
    fontWeight: '600',
    lineHeight: ms(18), // Using react-native-size-matters for responsive design - reduced from 20
  },
  detailValueContainer: {
    flex: 1.2,
  },
  detailValue: {
    fontSize: ms(13), // Using react-native-size-matters for responsive design - reduced from 15
    fontWeight: '500',
    lineHeight: ms(19), // Using react-native-size-matters for responsive design - reduced from 22
    textAlign: 'right',
  },
  emptyState: {
    paddingVertical: ms(36), // Using react-native-size-matters for responsive design - reduced from 48
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    padding: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    borderRadius: ms(40), // Using react-native-size-matters for responsive design - reduced from 50
    marginBottom: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyIcon: {
    fontSize: ms(28), // Using react-native-size-matters for responsive design - reduced from 32
  },
  emptyStateTitle: {
    fontSize: ms(16), // Using react-native-size-matters for responsive design - reduced from 18
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: ms(6), // Using react-native-size-matters for responsive design - reduced from 8
  },
  emptyStateText: {
    fontSize: ms(13), // Using react-native-size-matters for responsive design - reduced from 15
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: ms(19), // Using react-native-size-matters for responsive design - reduced from 22
    paddingHorizontal: ms(16), // Using react-native-size-matters for responsive design - reduced from 20
  },
});

export default ProductDescriptionPresenter; 