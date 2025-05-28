import React, { useState, useEffect, useCallback } from 'react';
import CategoryListPresenter from './CategoryListPresenter';
import CategoryListSkeleton from './CategoryListSkeleton/CategoryListSkeleton';
import categoriesService from '../../../services/categoriesService';

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

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Logique de génération du skeleton
  const generateSkeleton = useCallback(() => {
    return <CategoryListSkeleton itemCount={6} />;
  }, []);

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
      
      // For development: Add some mock data if API fails
      if (__DEV__) {
        setCategories([
          {
            id: 1,
            name: 'Plâtrerie',
            level: 1,
            alias: 'platrerie',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
          {
            id: 2,
            name: 'Isolation',
            level: 1,
            alias: 'isolation',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
          {
            id: 3,
            name: 'Sanitaire',
            level: 1,
            alias: 'sanitaire',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
          {
            id: 4,
            name: 'Plomberie',
            level: 1,
            alias: 'plomberie',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
          {
            id: 5,
            name: 'Électricité',
            level: 1,
            alias: 'electricite',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
          {
            id: 6,
            name: 'Peinture',
            level: 1,
            alias: 'peinture',
            haveParent: false,
            haveChildren: true,
            agenceId: 1,
          },
        ]);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category);
    // TODO: Navigate to category details or products
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  return (
    <CategoryListPresenter
      categories={categories}
      loading={loading}
      error={error}
      onCategoryPress={handleCategoryPress}
      onRefresh={handleRefresh}
      skeleton={generateSkeleton()}
    />
  );
};

export default CategoryList;