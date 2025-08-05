import React, { useState, useEffect } from "react";
import { View, Platform, StyleSheet, Dimensions, Animated, Keyboard } from "react-native";
import {
  faHome,
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faUser as faUserRegular,
} from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SafeAreaView , useSafeAreaInsets } from "react-native-safe-area-context";
import CurvedBottomBar from "./CurvedBottomBar/CurvedBottomBar";
import colors from "src/utils/colors";
import { moderateScale as ms } from "react-native-size-matters";
import TabItem from "./TabItem/TabItem";
import {
  BOTTOM_BAR_HEIGHT,
  CART_BUTTON_SIZE,
  SCREEN_WIDTH,
  ICON_SIZE,
} from "./constants";
import { isTablet } from "src/utils/deviceUtils";
import { useKeyboard } from "src/hooks/useKeyboard";

interface BottomBarPresenterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  renderScreen: (tabName: string) => React.ReactNode;
  isEmailUnverified?: boolean;
}

const CART_ELEVATION = Platform.OS === "ios" ? ms(16) : ms(22);

const BottomBarPresenter: React.FC<BottomBarPresenterProps> = ({
  activeTab,
  onTabPress,
  renderScreen,
  isEmailUnverified = false,
}) => {
  const insets = useSafeAreaInsets();
  const { keyboardShown, keyboardHeight, keyboardAnimationDuration } = useKeyboard();
  const bottomInset =
    Platform.OS == "android"
      ? Math.max(insets.bottom, 10)
      : isTablet()
      ? Math.max(insets.bottom, 10)
      : Math.max(insets.bottom, 10) - 14;

  // État pour les dimensions de l'écran (utile pour la rotation)
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: BOTTOM_BAR_HEIGHT + bottomInset,
  });

  // Animation du bottom bar
  const [bottomBarAnimation] = useState(new Animated.Value(0));
  
  // Fallback direct pour le clavier
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Mise à jour des dimensions en cas de changement d'orientation
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Dimensions.get("window").width,
        height: BOTTOM_BAR_HEIGHT + bottomInset,
      });
    };

    // Utilisation de l'API moderne pour les écouteurs d'événements
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );

    return () => {
      subscription.remove();
    };
  }, [bottomInset]);

  // Gestion de l'affichage/masquage du bottom bar avec le clavier
  useEffect(() => {
    console.log('🔄 BottomBar: keyboardShown changed:', keyboardShown);
    if (keyboardShown) {
      console.log('📱 Hiding bottom bar with animation');
      // Animation pour cacher le bottom bar (déplacer vers le bas)
      Animated.timing(bottomBarAnimation, {
        toValue: BOTTOM_BAR_HEIGHT + bottomInset,
        duration: keyboardAnimationDuration || 250,
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ Bottom bar hidden');
      });
    } else {
      console.log('📱 Showing bottom bar with animation');
      // Animation pour afficher le bottom bar (remettre en position)
      Animated.timing(bottomBarAnimation, {
        toValue: 0,
        duration: keyboardAnimationDuration || 250,
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ Bottom bar shown');
      });
    }
  }, [keyboardShown, bottomBarAnimation, bottomInset, keyboardAnimationDuration]);

  // Fallback: écoute directe du clavier au cas où le hook ne fonctionne pas
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      console.log('🔄 FALLBACK: Keyboard shown via direct listener');
      setKeyboardVisible(true);
      if (!keyboardShown) {
        console.log('🔄 FALLBACK: Hook failed, using fallback animation');
        Animated.timing(bottomBarAnimation, {
          toValue: BOTTOM_BAR_HEIGHT + bottomInset,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('🔄 FALLBACK: Keyboard hidden via direct listener');
      setKeyboardVisible(false);
      if (!keyboardShown) {
        console.log('🔄 FALLBACK: Hook failed, using fallback animation');
        Animated.timing(bottomBarAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [keyboardShown, bottomBarAnimation, bottomInset]);

  // Configuration des tabs
  const tabs = [
    { name: "Home", label: "Accueil", icon: faHome },
    { name: "Search", label: "Recherche", icon: faSearch },
    {
      name: "Favorite",
      label: "Favoris",
      icon: activeTab === "Favorite" ? faHeart : faHeartRegular,
    },
    {
      name: "Profil",
      label: "Profil",
      icon: activeTab === "Profil" ? faUser : faUserRegular,
      hasEmailWarning: isEmailUnverified,
    },
  ];

  // Séparation de l'onglet Panier pour un traitement spécial
  const cartTab = { name: "Cart", label: "Panier", icon: faShoppingCart };

  // Exemple de nombre d'articles dans le panier (à remplacer par une vraie logique)
  const cartItemCount = 0;

  return (
    <View style={styles.container}>
      {/* Contenu principal avec padding pour éviter que le contenu ne soit sous le bouton panier */}
      <View style={styles.content}>{renderScreen(activeTab)}</View>

      {/* Barre de navigation avec creux arrondi */}
      <Animated.View
        style={[
          styles.bottomBarContainer,
          { 
            height: BOTTOM_BAR_HEIGHT + bottomInset,
            transform: [{ translateY: bottomBarAnimation }]
          },
        ]}
        pointerEvents={keyboardShown || keyboardVisible ? "none" : "box-none"}
      >
        {/* Fond de la barre avec creux */}
        <CurvedBottomBar
          width={dimensions.width}
          height={
            Platform.OS == "android" ? dimensions.height : dimensions.height
          }
          color={colors.secondary[800]}
          cartButtonSize={CART_BUTTON_SIZE}
        />

        {/* Contenu de la barre de navigation */}
        <View style={[styles.bottomBarContent, { paddingBottom: bottomInset }]}>
          {/* Première moitié des onglets */}
          <View style={styles.tabGroup}>
            {tabs.slice(0, 2).map((tab) => (
              <TabItem
                key={tab.name}
                icon={tab.icon as IconProp}
                label={tab.label}
                isActive={activeTab === tab.name}
                onPress={() => onTabPress(tab.name)}
              />
            ))}
          </View>

          {/* Espace pour le creux */}
          <View style={styles.centerSpace} />

          {/* Seconde moitié des onglets */}
          <View style={styles.tabGroup}>
            {tabs.slice(2).map((tab) => (
              <TabItem
                key={tab.name}
                icon={tab.icon as IconProp}
                label={tab.label}
                isActive={activeTab === tab.name}
                onPress={() => onTabPress(tab.name)}
                hasEmailWarning={tab.hasEmailWarning}
              />
            ))}
          </View>
        </View>

        {/* Bouton panier flottant */}
        <View pointerEvents="box-none" style={styles.cartButtonContainer}>
          <TabItem
            key={cartTab.name}
            icon={cartTab.icon as IconProp}
            label=""
            isActive={activeTab === cartTab.name}
            onPress={() => onTabPress(cartTab.name)}
            isCartTab={true}
            customIconStyle={styles.cartIconContainer}
            customLabelStyle={styles.cartLabelContainer}
            customTextStyle={styles.cartLabel}
            badgeCount={cartItemCount}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "visible",
  },
  bottomBarContent: {
    flexDirection: "row",
    paddingTop: ms(6),
  },
  tabGroup: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  centerSpace: {
    width: CART_BUTTON_SIZE + ms(25),
  },
  cartButtonContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios" ? -CART_ELEVATION - ms(4) : -CART_ELEVATION + ms(2),
    alignSelf: "center",
    zIndex: 10,
    width: CART_BUTTON_SIZE,
    height: CART_BUTTON_SIZE,
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  cartIconContainer: {
    width: CART_BUTTON_SIZE + ms(4),
    height: CART_BUTTON_SIZE + ms(4),
    borderRadius: CART_BUTTON_SIZE / 2 + ms(4),
    backgroundColor: colors.secondary[500],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.tertiary[500],
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: ms(2.5),
    borderColor: colors.primary[50],
    overflow: "visible",
  },
  cartLabelContainer: {
    display: "none",
  },
  cartLabel: {
    fontSize: ms(9),
    fontWeight: "bold",
    color: colors.primary[50],
  },
});

export default BottomBarPresenter;
