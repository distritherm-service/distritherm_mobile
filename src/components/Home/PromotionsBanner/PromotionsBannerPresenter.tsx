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
import { useColors } from "src/hooks/useColors";
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
  const colors = useColors();
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

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    bannerContainer: {
      width: screenWidth - ms(40), // Using react-native-size-matters for responsive calculation
      height: ms(180), // Using react-native-size-matters for responsive height
      borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
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
    discoverButtonContainer: {
      position: "absolute",
      bottom: ms(10), // Using react-native-size-matters for responsive positioning
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    discoverButton: {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      paddingHorizontal: ms(16), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(6), // Using react-native-size-matters for responsive padding
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
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
    discoverText: {
      color: colors.tertiary[800],
      fontSize: ms(14), // Using react-native-size-matters for responsive font size
      fontWeight: "600",
      letterSpacing: 0.3,
    },
    buttonIcon: {
      marginLeft: ms(6), // Using react-native-size-matters for responsive margin
    },
  });

  return (
    <View style={dynamicStyles.bannerContainer}>
      {/* Image avec skeleton de chargement */}
      <View style={dynamicStyles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[dynamicStyles.bannerImage, isImageLoading && { opacity: 0 }]}
          resizeMode="stretch"
          onLoad={() => onImageLoad(item.id.toString())}
          onError={() => onImageError(item.id.toString())}
        />
        
        {/* Skeleton pendant le chargement de l'image */}
        {isImageLoading && (
          <View style={dynamicStyles.imageSkeleton}>
            <Animated.View
              style={[
                dynamicStyles.shimmerOverlay,
                {
                  opacity: shimmerOpacity,
                  transform: [{ translateX: shimmerTranslateX }],
                },
              ]}
            />
          </View>
        )}
      </View>

      <View style={dynamicStyles.bannerOverlay} />

      {/* Discover Button for this specific promotion */}
      <View style={dynamicStyles.discoverButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            dynamicStyles.discoverButton,
            pressed && globalStyles.buttonPressed,
          ]}
          onPress={() => onDiscoverPress(item)}
        >
          <Text style={dynamicStyles.discoverText}>Découvrez</Text>
          <FontAwesomeIcon
            icon={faArrowRight}
            size={ms(12)} // Using react-native-size-matters for responsive icon size
            color={colors.tertiary[800]}
            style={dynamicStyles.buttonIcon}
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
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      height: ms(240), // Using react-native-size-matters for responsive height
      width: "100%",
    },
    bannerWrapper: {
      position: "relative",
      height: "100%",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: ms(16), // Using react-native-size-matters for responsive margin
      marginBottom: ms(8), // Using react-native-size-matters for responsive margin
    },
    paginationDot: {
      width: ms(8), // Using react-native-size-matters for responsive width
      height: ms(8), // Using react-native-size-matters for responsive height
      borderRadius: ms(4), // Using react-native-size-matters for responsive border radius
      backgroundColor: colors.tertiary[300],
      marginHorizontal: ms(4), // Using react-native-size-matters for responsive margin
      opacity: 0.5,
    },
    activePaginationDot: {
      backgroundColor: colors.primary[600],
      opacity: 1,
      transform: [{ scale: 1.2 }],
    },
  });

  return (
    <View style={[globalStyles.container, dynamicStyles.container]}>
      <View style={dynamicStyles.bannerWrapper}>
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
          <View style={dynamicStyles.paginationContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  dynamicStyles.paginationDot,
                  index === currentIndex && dynamicStyles.activePaginationDot,
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
