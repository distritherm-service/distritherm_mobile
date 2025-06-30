import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import categoriesService from '../../services/categoriesService';
import { SearchParams, RootStackParamList } from 'src/navigation/types';
import CategoriesPresenter from './CategoriesPresenter';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  level: number;
  alias: string;
  haveParent: boolean;
  haveChildren: boolean;
  description?: string;
  parentCategoryId?: number;
  agenceId: number;
}

/**
 * Container component for Categories
 * Handles business logic, data fetching, and state management
 */
const Categories = () => {
  const navigation = useNavigation<NavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoriesService.getAllCategories();
      
      // Handle different response structures
      let categoriesData = response.categories;
      if (response.data) {
        categoriesData = response.data;
      }
      
      // Ensure we have an array
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        console.warn('Categories response is not an array:', categoriesData);
        setCategories([]);
      }
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search query only
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.alias.toLowerCase().includes(query)
      );
    }

    // Sort categories alphabetically by name (French locale)
    filtered.sort((a, b) => {
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
    });

    return filtered;
  }, [categories, searchQuery]);

  const handleCategoryPress = (category: Category) => {
    // Navigate to search with category filter
    navigation.navigate('Main', {
      initialTab: 'Search',
      searchParams: {
        status: 'onSearch',
        filter: {
          categoryId: category.id,
        }
      }
    });
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <CategoriesPresenter
      categories={filteredCategories}
      allCategories={categories}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onCategoryPress={handleCategoryPress}
      onRefresh={handleRefresh}
      onSearchChange={handleSearchChange}
    />
  );
};

export default Categories; 