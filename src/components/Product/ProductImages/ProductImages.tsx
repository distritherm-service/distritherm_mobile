import React, { useState, useCallback } from "react";
import ProductImagesPresenter from "./ProductImagesPresenter";

interface ProductImagesProps {
  images?: string[];
  onImagePress?: (index: number) => void;
  enableZoom?: boolean;
  showIndicators?: boolean;
}

const ProductImages: React.FC<ProductImagesProps> = ({ 
  images = [], 
  onImagePress,
  enableZoom = false,
  showIndicators = true 
}) => {
  // Business logic: Track current image index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Business logic: Track image loading states
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: number]: 'loading' | 'loaded' | 'error' }>({});

  // Business logic: Handle scroll to update current index
  const handleScroll = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Business logic: Handle image press
  const handleImagePress = useCallback((index: number) => {
    onImagePress?.(index);
  }, [onImagePress]);

  // Business logic: Handle image load states
  const handleImageLoad = useCallback((index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'loaded' }));
  }, []);

  const handleImageError = useCallback((index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
  }, []);

  const handleImageLoadStart = useCallback((index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'loading' }));
  }, []);

  return (
    <ProductImagesPresenter 
      images={images}
      currentIndex={currentIndex}
      imageLoadStates={imageLoadStates}
      onScroll={handleScroll}
      onImagePress={handleImagePress}
      onImageLoad={handleImageLoad}
      onImageError={handleImageError}
      onImageLoadStart={handleImageLoadStart}
      enableZoom={enableZoom}
      showIndicators={showIndicators}
    />
  );
};

export default ProductImages;
