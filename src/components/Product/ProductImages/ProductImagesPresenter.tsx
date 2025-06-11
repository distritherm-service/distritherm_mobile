import React, { useRef, memo } from "react";
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  Text,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import { ms, s, vs } from "react-native-size-matters"; // Using react-native-size-matters for responsive design

interface ProductImagesPresenterProps {
  images: string[];
  currentIndex: number;
  imageLoadStates: { [key: number]: 'loading' | 'loaded' | 'error' };
  onScroll: (index: number) => void;
  onImagePress: (index: number) => void;
  onImageLoad: (index: number) => void;
  onImageError: (index: number) => void;
  onImageLoadStart: (index: number) => void;
  enableZoom: boolean;
  showIndicators: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const ProductImagesPresenter: React.FC<ProductImagesPresenterProps> = memo(({
  images,
  currentIndex,
  imageLoadStates,
  onScroll,
  onImagePress,
  onImageLoad,
  onImageError,
  onImageLoadStart,
  enableZoom,
  showIndicators,
}) => {
  const flatListRef = useRef<FlatList>(null);

  // Handle momentum scroll end for pagination
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    if (index !== currentIndex && index >= 0 && index < images.length) {
      onScroll(index);
    }
  };

  // Render individual image item with better pagination layout
  const renderImageItem = ({ item, index }: { item: string; index: number }) => {
    const loadState = imageLoadStates[index];
    
    return (
      <View style={styles.imageSlide}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => onImagePress(index)}
          activeOpacity={enableZoom ? 0.9 : 1}
          disabled={!enableZoom}
        >
          <View style={styles.imageWrapper}>
            {/* Loading indicator */}
            {loadState === 'loading' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
            
            {/* Error state */}
            {loadState === 'error' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>📷</Text>
                <Text style={styles.errorText}>Failed to load image</Text>
                <Text style={styles.retryText}>Tap to retry</Text>
              </View>
            )}
            
            {/* Image */}
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => onImageLoadStart(index)}
              onLoad={() => onImageLoad(index)}
              onError={() => onImageError(index)}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Render modern pagination indicators
  const renderIndicators = () => {
    if (!showIndicators || images.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorWrapper}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  // Render image counter with better styling
  const renderCounter = () => {
    if (images.length <= 1) return null;

    return (
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    );
  };

  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImageItem}
        horizontal
        pagingEnabled={true} // Key for pagination behavior
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd} // Better for pagination
        decelerationRate="fast" // Faster deceleration for snappy pagination
        bounces={false} // Disable bouncing for cleaner pagination
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        // Performance optimizations for smooth pagination
        removeClippedSubviews={true}
        maxToRenderPerBatch={2} // Reduced for better pagination performance
        windowSize={3} // Smaller window for pagination
        initialNumToRender={1}
        snapToInterval={screenWidth} // Ensures perfect snapping to each image
        snapToAlignment="start" // Aligns to start of each item
        disableIntervalMomentum={true} // Prevents multiple page scrolling
      />
      
      {/* Indicators */}
      {renderIndicators()}
      
      {/* Counter */}
      {renderCounter()}
    </View>
  );
});

ProductImagesPresenter.displayName = 'ProductImagesPresenter';

export default ProductImagesPresenter;

const styles = StyleSheet.create({
  container: {
    height: vs(320), // Slightly increased height for better visual impact
    backgroundColor: '#ffffff',
    borderRadius: ms(16), // More rounded corners for modern look
    overflow: 'hidden',
  },
  imageSlide: {
    width: screenWidth,
    height: vs(320),
    paddingHorizontal: ms(4), // Small padding for better visual separation
  },
  imageContainer: {
    flex: 1,
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: ms(14),
    color: '#6c757d',
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    zIndex: 1,
  },
  errorIcon: {
    fontSize: ms(48),
    marginBottom: vs(12),
  },
  errorText: {
    fontSize: ms(16),
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: vs(4),
  },
  retryText: {
    fontSize: ms(12),
    color: '#6c757d',
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: vs(20),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
    borderRadius: ms(16),
  },
  indicator: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: s(3),
  },
  activeIndicator: {
    backgroundColor: '#ffffff',
    width: ms(18), // Smaller elongated active indicator
    transform: [{ scale: 1 }],
  },
  counterContainer: {
    position: 'absolute',
    top: vs(16),
    right: s(16),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(12),
  },
  counterText: {
    color: '#ffffff',
    fontSize: ms(11),
    fontWeight: '600',
  },
  emptyContainer: {
    height: vs(320),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: ms(16),
  },
  emptyIcon: {
    fontSize: ms(64),
    marginBottom: vs(16),
  },
  emptyText: {
    fontSize: ms(18),
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
});
