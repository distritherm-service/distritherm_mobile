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
  onClearIndividualFilter?: (filterType: 'category' | 'mark' | 'price' | 'promotion') => void;
  onClearAllFilters?: () => void;
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
  onClearIndividualFilter,
  onClearAllFilters,
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

  const handleCategorySelect = (categoryId: number) => {
    setTempFilter((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
    }));
  };

  const handleMarkSelect = (markId: number) => {
    setTempFilter((prev) => ({
      ...prev,
      markId: prev.markId === markId ? undefined : markId,
    }));
  };

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    setTempFilter((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  const handleMinPriceChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const minPrice = cleanText ? parseInt(cleanText) : undefined;
    handlePriceChange(minPrice, tempFilter.maxPrice);
  };

  const handleMaxPriceChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const maxPrice = cleanText ? parseInt(cleanText) : undefined;
    handlePriceChange(tempFilter.minPrice, maxPrice);
  };

  const handlePromotionToggle = () => {
    setTempFilter((prev) => ({
      ...prev,
      inPromotion: !prev.inPromotion,
    }));
  };

  const handleClearAll = () => {
    if (onClearAllFilters) {
      // Use immediate clearing if available
      onClearAllFilters();
      onClose();
    } else {
      // Fallback to old behavior
      setTempFilter({});
      onApplyFilter({});
      onClose();
    }
  };

  const handleClearIndividual = (filterType: 'category' | 'mark' | 'price' | 'promotion') => {
    if (onClearIndividualFilter) {
      // Use immediate clearing if available
      onClearIndividualFilter(filterType);
      onClose();
    } else {
      // Fallback to temp filter update
      const newTempFilter = { ...tempFilter };
      
      switch (filterType) {
        case 'category':
          delete newTempFilter.categoryId;
          break;
        case 'mark':
          delete newTempFilter.markId;
          break;
        case 'price':
          delete newTempFilter.minPrice;
          delete newTempFilter.maxPrice;
          break;
        case 'promotion':
          delete newTempFilter.inPromotion;
          break;
      }
      
      setTempFilter(newTempFilter);
    }
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

  // Generate category options for the UI
  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.id.toString(),
  }));

  // Find selected category
  const selectedCategory = tempFilter.categoryId 
    ? categoryOptions.find(option => parseInt(option.value) === tempFilter.categoryId)
    : undefined;

  // Generate mark options for the UI
  const markOptions = marks.map(mark => ({
    label: mark.name,
    value: mark.id.toString(),
  }));

  // Find selected mark
  const selectedMark = tempFilter.markId 
    ? markOptions.find(option => parseInt(option.value) === tempFilter.markId)
    : undefined;

  return (
    <FilterModalPresenter
      isVisible={isVisible}
      isLoadingCategories={isLoadingFilterData || false}
      isLoadingMarks={isLoadingFilterData || false}
      tempFilter={tempFilter}
      activeFiltersCount={getActiveFiltersCount()}
      // Category options for the UI
      categoryOptions={categoryOptions}
      selectedCategory={selectedCategory}
      // Mark options for the UI
      markOptions={markOptions}
      selectedMark={selectedMark}
      onClose={onClose}
      onCategorySelect={handleCategorySelect}
      onMarkSelect={handleMarkSelect}
      onPriceChange={handlePriceChange}
      onMinPriceChange={handleMinPriceChange}
      onMaxPriceChange={handleMaxPriceChange}
      onPromotionToggle={handlePromotionToggle}
      onClearAll={handleClearAll}
      onClearIndividual={handleClearIndividual}
      onApply={handleApply}
      // Animation props
      slideAnim={slideAnim}
      overlayOpacity={overlayOpacity}
    />
  );
};

export default FilterModal;
