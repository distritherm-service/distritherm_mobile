import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Category } from './CategoryList';
import { colors } from '../../../utils/colors';
import { ms } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

interface CategoryListPresenterProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  onCategoryPress: (category: Category) => void;
  onRefresh: () => void;
  skeleton: React.ReactElement;
}

const CategoryListPresenter: React.FC<CategoryListPresenterProps> = ({
  categories,
  loading,
  error,
  onCategoryPress,
  onRefresh,
  skeleton,
}) => {
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Pressable
      style={styles.categoryCard}
      onPress={() => onCategoryPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl || DEFAULT_IMAGE_URL }} 
          style={styles.categoryImage}
          defaultSource={{ uri: DEFAULT_IMAGE_URL }}
        />
        {item.haveChildren && <View style={styles.childrenIndicator} />}
      </View>
      
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>Aucune catégorie disponible</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return skeleton;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur de chargement</Text>
          <Pressable style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={ms(90)} // Snap to each item
        snapToAlignment="start"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Catégories</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
  },
  sectionTitle: {
    fontSize: ms(22),
    fontWeight: '700',
    color: colors.text,
    marginBottom: ms(16),
    paddingHorizontal: ms(20),
    letterSpacing: -0.5,
  },
  flatListContent: {
    paddingHorizontal: ms(20),
  },
  separator: {
    width: ms(16),
  },
  categoryCard: {
    alignItems: 'center',
    width: ms(80),
  },
  imageContainer: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    marginBottom: ms(10),
    overflow: 'hidden',
    backgroundColor: colors.primary[100],
    position: 'relative',
    shadowColor: colors.tertiary[500],
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.08,
    shadowRadius: ms(8),
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  childrenIndicator: {
    position: 'absolute',
    top: ms(4),
    right: ms(4),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.secondary[400],
    borderWidth: ms(1.5),
    borderColor: colors.primary[50],
  },
  categoryName: {
    fontSize: ms(11),
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: ms(13),
    maxWidth: ms(75),
    letterSpacing: -0.2,
  },
  errorContainer: {
    height: ms(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(20),
  },
  errorText: {
    fontSize: ms(14),
    color: colors.tertiary[400],
    marginBottom: ms(12),
    fontWeight: '400',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.secondary[400],
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderRadius: ms(20),
  },
  retryText: {
    color: colors.primary[50],
    fontSize: ms(12),
    fontWeight: '600',
  },
  emptyStateContainer: {
    height: ms(100),
    justifyContent: 'center',
    alignItems: 'center',
    width: width - ms(40),
  },
  emptyStateText: {
    fontSize: ms(14),
    color: colors.tertiary[400],
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default CategoryListPresenter;