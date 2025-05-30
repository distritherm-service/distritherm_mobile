import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  Text,
  Pressable,
  Animated,
} from "react-native";
import React, { RefObject, useRef, useEffect } from "react";
import { globalStyles } from "src/utils/globalStyles";
import { PromotionBannerDto } from "src/services/promotionBannersService";
import { ms } from "react-native-size-matters";
import colors from "src/utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface PromotionsBannerPresenterProps {
  banners: PromotionBannerDto[];
  flatlistRef: RefObject<FlatList | null>;
  currentIndex: number;
  imageLoadingStates: {[key: string]: boolean};
  onDiscoverPress: () => void;
  onScrollEnd: (event: any) => void;
  onImageLoad: (bannerId: string) => void;
  onImageError: (bannerId: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");

const PromotionBannerItem = ({
  item,
  isImageLoading,
  onDiscoverPress,
  onImageLoad,
  onImageError,
}: {
  item: PromotionBannerDto;
  isImageLoading: boolean;
  onDiscoverPress: (promotion: PromotionBannerDto) => void;
  onImageLoad: (bannerId: string) => void;
  onImageError: (bannerId: string) => void;
}) => {
  // Animation pour le skeleton de l'image
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isImageLoading) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();

      return () => shimmerAnimation.stop();
    }
  }, [isImageLoading]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <View style={styles.bannerContainer}>
      {/* Image avec skeleton de chargement */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.bannerImage, isImageLoading && { opacity: 0 }]}
          resizeMode="stretch"
          onLoad={() => onImageLoad(item.id.toString())}
          onError={() => onImageError(item.id.toString())}
        />
        
        {/* Skeleton pendant le chargement de l'image */}
        {isImageLoading && (
          <View style={styles.imageSkeleton}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  opacity: shimmerOpacity,
                  transform: [{ translateX: shimmerTranslateX }],
                },
              ]}
            />
          </View>
        )}
      </View>

      <View style={styles.bannerOverlay} />

      {/* Discover Button for this specific promotion */}
      <View style={styles.discoverButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.discoverButton,
            pressed && globalStyles.buttonPressed,
          ]}
          onPress={() => onDiscoverPress(item)}
        >
          <Text style={styles.discoverText}>Découvrez</Text>
          <FontAwesomeIcon
            icon={faArrowRight}
            size={ms(12)}
            color={colors.tertiary[800]}
            style={styles.buttonIcon}
          />
        </Pressable>
      </View>
    </View>
  );
};

const PromotionsBannerPresenter = ({
  banners,
  flatlistRef,
  currentIndex,
  imageLoadingStates,
  onDiscoverPress,
  onScrollEnd,
  onImageLoad,
  onImageError,
}: PromotionsBannerPresenterProps) => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.bannerWrapper}>
        <FlatList
          ref={flatlistRef}
          data={banners}
          renderItem={({ item }) => (
            <PromotionBannerItem
              item={item}
              isImageLoading={imageLoadingStates[item.id.toString()] || false}
              onDiscoverPress={onDiscoverPress}
              onImageLoad={onImageLoad}
              onImageError={onImageError}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd}
          bounces={false}
          overScrollMode="never"
        />

        {/* Pagination Dots */}
        {banners.length > 1 && (
          <View style={styles.paginationContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.activePaginationDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default PromotionsBannerPresenter;

const styles = StyleSheet.create({
  container: {
    height: ms(240),
    width: "100%",
  },
  bannerWrapper: {
    position: "relative",
    height: "100%",
  },
  bannerContainer: {
    width: screenWidth - ms(40), // ms(40) pour le padding horizontal
    height: ms(180),
    borderRadius: ms(16),
    overflow: "hidden",
    marginHorizontal: 0,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  imageSkeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[200],
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[100],
    opacity: 0.7,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: ms(16),
    marginBottom: ms(8),
  },
  paginationDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.tertiary[300],
    marginHorizontal: ms(4),
    opacity: 0.5,
  },
  activePaginationDot: {
    backgroundColor: colors.primary[600],
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  discoverButtonContainer: {
    position: "absolute",
    bottom: ms(10),
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  discoverButton: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  discoverButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transform: [{ scale: 0.96 }],
  },
  discoverText: {
    color: colors.tertiary[800],
    fontSize: ms(14),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: ms(6),
  },
});
