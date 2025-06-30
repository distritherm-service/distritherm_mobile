import React, { useState, useEffect, useCallback } from 'react';
import CategoryListPresenter from './CategoryListPresenter';
import CategoryListSkeleton from './CategoryListSkeleton/CategoryListSkeleton';
import categoriesService from '../../../services/categoriesService';
import { SearchParams } from 'src/navigation/types';

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

interface CategoryListProps {
  onNavigateToSearch?: (params: SearchParams) => void;
  onViewAll?: () => void;
}

const CategoryList = ({ onNavigateToSearch, onViewAll }: CategoryListProps) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to search with category filter
    if (onNavigateToSearch) {
      onNavigateToSearch({
        status: 'onSearch',
        filter: {
          categoryId: category.id,
        }
      });
    }
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
      onViewAll={onViewAll}
      skeleton={generateSkeleton()}
    />
  );
};

export default CategoryList;