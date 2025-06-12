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
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { useColors } from "src/hooks/useColors";

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
  const colors = useColors();

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = {
    indicatorWrapper: {
      backgroundColor: colors.tertiary[800] + '99', // Semi-transparent dark background
    },
    indicator: {
      backgroundColor: colors.surface + '80', // Semi-transparent white
    },
    counterContainer: {
      backgroundColor: colors.tertiary[800] + 'B3', // Semi-transparent dark background
    },
  };

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
              <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
              </View>
            )}
            
            {/* Error state */}
            {loadState === 'error' && (
              <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
                <Text style={styles.errorIcon}>📷</Text>
                <Text style={[styles.errorText, { color: colors.error[500] }]}>Failed to load image</Text>
                <Text style={[styles.retryText, { color: colors.textSecondary }]}>Tap to retry</Text>
              </View>
            )}
            
            {/* Image */}
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="stretch"
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
        <View style={[styles.indicatorWrapper, dynamicStyles.indicatorWrapper]}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                dynamicStyles.indicator,
                index === currentIndex && [styles.activeIndicator, { backgroundColor: colors.surface }],
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
      <View style={[styles.counterContainer, dynamicStyles.counterContainer]}>
        <Text style={[styles.counterText, { color: colors.surface }]}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    );
  };

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No images available</Text>
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
    height: ms(350), // Increased height for better visual impact
    backgroundColor: 'transparent', // Remove background for cleaner look
    borderRadius: ms(16),
    overflow: 'hidden',
    marginBottom: ms(16), // Add spacing from next component
  },
  imageSlide: {
    width: screenWidth,
    height: ms(350),
  },
  imageContainer: {
    flex: 1,
    borderRadius: ms(16), // Increased border radius for modern look
    overflow: 'hidden',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'transparent', // Remove background to show actual image
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: ms(16),
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: ms(16),
  },
  loadingText: {
    marginTop: ms(12),
    fontSize: ms(14),
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
    zIndex: 1,
    borderRadius: ms(16),
  },
  errorIcon: {
    fontSize: ms(48),
    marginBottom: ms(12),
  },
  errorText: {
    fontSize: ms(16),
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: ms(4),
  },
  retryText: {
    fontSize: ms(12),
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: ms(24),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorWrapper: {
    flexDirection: 'row',
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: ms(20),
  },
  indicator: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginHorizontal: ms(4),
  },
  activeIndicator: {
    width: ms(24), // Elongated active indicator
    transform: [{ scale: 1 }],
  },
  counterContainer: {
    position: 'absolute',
    top: ms(20),
    right: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: ms(16),
  },
  counterText: {
    fontSize: ms(12),
    fontWeight: '600',
  },
  emptyContainer: {
    height: ms(350),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(16),
    marginHorizontal: ms(16),
  },
  emptyIcon: {
    fontSize: ms(64),
    marginBottom: ms(16),
  },
  emptyText: {
    fontSize: ms(18),
    textAlign: 'center',
    fontWeight: '500',
  },
});
