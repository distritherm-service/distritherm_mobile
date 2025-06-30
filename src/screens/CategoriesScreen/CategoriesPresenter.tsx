import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ms } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { useColors } from 'src/hooks/useColors';
import PageContainer from 'src/components/PageContainer/PageContainer';
import { Category } from './Categories';
import { FontAwesome6 } from '@expo/vector-icons';

const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

interface CategoriesPresenterProps {
  categories: Category[];
  allCategories: Category[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onCategoryPress: (category: Category) => void;
  onRefresh: () => void;
  onSearchChange: (query: string) => void;
}

/**
 * Presenter component for Categories
 * Modern and elegant UI with search functionality
 */
const CategoriesPresenter: React.FC<CategoriesPresenterProps> = ({
  categories,
  allCategories,
  loading,
  error,
  searchQuery,
  onCategoryPress,
  onRefresh,
  onSearchChange,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.background,
      paddingHorizontal: ms(20),
      paddingTop: ms(16),
      paddingBottom: ms(12),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statsContainer: {
      marginBottom: ms(16),
    },
    statsText: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      paddingHorizontal: ms(16),
      paddingVertical: ms(12), // Using react-native-size-matters for responsive design - increased for better size
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textSecondary,
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.05,
      shadowRadius: ms(4),
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: ms(14), // Using react-native-size-matters for responsive design
      color: colors.text,
      marginLeft: ms(12),
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    categoriesGrid: {
      padding: ms(20),
    },
    categoryCard: {
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      marginBottom: ms(16),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textSecondary,
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.08,
      shadowRadius: ms(8),
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: ms(12),
    },
    categoryImage: {
      width: ms(60),
      height: ms(60),
      borderRadius: ms(12),
      marginRight: ms(16),
      backgroundColor: colors.primary[100],
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: ms(18),
      fontWeight: '700',
      color: colors.text,
      marginBottom: ms(4),
      letterSpacing: -0.3,
    },

    categoryDescription: {
      fontSize: ms(14),
      color: colors.textSecondary,
      lineHeight: ms(20),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: ms(60),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      marginTop: ms(16),
      fontWeight: '500',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: ms(40),
      paddingVertical: ms(60),
    },
    errorText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: ms(20),
      lineHeight: ms(24),
    },
    retryButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: ms(20),
      paddingVertical: ms(12),
      borderRadius: ms(20),
    },
    retryButtonText: {
      fontSize: ms(14),
      fontWeight: '600',
      color: colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: ms(40),
      paddingVertical: ms(60),
    },
    emptyText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: ms(24),
    },
  });

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Pressable
      style={({ pressed }) => [
        dynamicStyles.categoryCard,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
      ]}
      onPress={() => onCategoryPress(item)}
    >
      <View style={dynamicStyles.categoryHeader}>
        <Image
          source={{ uri: item.imageUrl || DEFAULT_IMAGE_URL }}
          style={dynamicStyles.categoryImage}
          defaultSource={{ uri: DEFAULT_IMAGE_URL }}
        />
        <View style={dynamicStyles.categoryInfo}>
          <Text style={dynamicStyles.categoryName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={dynamicStyles.categoryDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={dynamicStyles.loadingText}>Chargement des catégories...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={dynamicStyles.errorContainer}>
          <FontAwesome6
            name="exclamation-triangle"
            size={ms(48)}
            color={colors.textSecondary}
          />
          <Text style={dynamicStyles.errorText}>{error}</Text>
          <Pressable style={dynamicStyles.retryButton} onPress={onRefresh}>
            <Text style={dynamicStyles.retryButtonText}>Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (categories.length === 0) {
      return (
        <View style={dynamicStyles.emptyContainer}>
          <FontAwesome6
            name="folder-open"
            size={ms(48)}
            color={colors.textSecondary}
          />
          <Text style={dynamicStyles.emptyText}>
            {searchQuery
              ? 'Aucune catégorie ne correspond à votre recherche.'
              : 'Aucune catégorie disponible pour le moment.'}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={dynamicStyles.categoriesGrid}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
      />
    );
  };

  return (
    <PageContainer 
      headerBack={true} 
      headerTitle="Catégories" 
      isScrollable={false}
      bottomBar={false}
    >
      <View style={dynamicStyles.container}>
        {/* Header with search */}
        <View style={dynamicStyles.header}>
          {/* Stats */}
          <View style={dynamicStyles.statsContainer}>
            <Text style={dynamicStyles.statsText}>
              {categories.length} catégorie{categories.length > 1 ? 's' : ''} 
              {allCategories.length !== categories.length && ` sur ${allCategories.length}`}
            </Text>
          </View>

          {/* Search */}
          <View style={dynamicStyles.searchContainer}>
            <FontAwesome6
              name="magnifying-glass"
              size={ms(16)}
              color={colors.textSecondary}
            />
            <TextInput
              style={dynamicStyles.searchInput}
              placeholder="Rechercher une catégorie..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onSearchChange('')}>
                <FontAwesome6
                  name="xmark"
                  size={ms(16)}
                  color={colors.textSecondary}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={dynamicStyles.content}>
          {renderContent()}
        </View>
      </View>
    </PageContainer>
  );
};

export default CategoriesPresenter; 