import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  ScrollView, 
  Dimensions,
  TouchableOpacity 
} from 'react-native';
import { moderateScale as ms, scale as s } from 'react-native-size-matters';
import colors from 'src/utils/colors';

interface ProductImagesPresenterProps {
  images: string[];
}

const { width } = Dimensions.get('window');
const imageWidth = width;
const imageHeight = width * 0.8; // 4:3 aspect ratio

const ProductImagesPresenter: React.FC<ProductImagesPresenterProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / imageWidth);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.placeholderImage} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ProductImagesPresenter;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  emptyContainer: {
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: colors.primary[200],
    borderRadius: ms(12),
  },
  scrollView: {
    height: imageHeight,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  pagination: {
    position: 'absolute',
    bottom: ms(16),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginHorizontal: ms(4),
  },
  activeDot: {
    backgroundColor: colors.secondary[400],
  },
  inactiveDot: {
    backgroundColor: colors.primary[50],
    opacity: 0.7,
  },
});