import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SearchFilter } from "src/navigation/types";
import FilterModalPresenter from "./FilterModalPresenter";

interface Category {
  id: number;
  name: string;
}

interface Mark {
  id: number;
  name: string;
}

interface FilterModalProps {
  isVisible: boolean;
  currentFilter: SearchFilter;
  preLoadedCategories?: Category[];
  preLoadedMarks?: Mark[];
  isLoadingFilterData?: boolean;
  onClose: () => void;
  onApplyFilter: (filter: SearchFilter) => void;
}

/**
 * Container component for FilterModal
 * Handles all business logic for search filters
 */
const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  currentFilter,
  preLoadedCategories,
  preLoadedMarks,
  isLoadingFilterData,
  onClose,
  onApplyFilter,
}) => {
  // Use pre-loaded data
  const categories = preLoadedCategories || [];
  const marks = preLoadedMarks || [];

  // State for current filter values
  const [tempFilter, setTempFilter] = useState<SearchFilter>(currentFilter);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;


  // Handle modal visibility animations
  useEffect(() => {
    if (isVisible) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isVisible]);

  // Update temp filter when current filter changes
  useEffect(() => {
    setTempFilter(currentFilter);
  }, [currentFilter]);


  const animateIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    setTempFilter(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
      categoryName: prev.categoryId === categoryId ? undefined : categoryName,
    }));
  };

  const handleMarkSelect = (markId: number, markName: string) => {
    setTempFilter(prev => ({
      ...prev,
      markId: prev.markId === markId ? undefined : markId,
      markName: prev.markId === markId ? undefined : markName,
    }));
  };

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    setTempFilter(prev => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  const handlePromotionToggle = () => {
    setTempFilter(prev => ({
      ...prev,
      inPromotion: !prev.inPromotion,
    }));
  };

  const handleClearAll = () => {
    setTempFilter({});
  };

  const handleApply = () => {
    onApplyFilter(tempFilter);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilter.categoryId) count++;
    if (tempFilter.markId) count++;
    if (tempFilter.minPrice || tempFilter.maxPrice) count++;
    if (tempFilter.inPromotion) count++;
    return count;
  };

  return (
    <FilterModalPresenter
      isVisible={isVisible}
      categories={categories}
      marks={marks}
      isLoadingCategories={isLoadingFilterData || false}
      isLoadingMarks={isLoadingFilterData || false}
      tempFilter={tempFilter}
      activeFiltersCount={getActiveFiltersCount()}
      onClose={onClose}
      onCategorySelect={handleCategorySelect}
      onMarkSelect={handleMarkSelect}
      onPriceChange={handlePriceChange}
      onPromotionToggle={handlePromotionToggle}
      onClearAll={handleClearAll}
      onApply={handleApply}
      slideAnim={slideAnim}
      overlayOpacity={overlayOpacity}
    />
  );
};

export default FilterModal; 