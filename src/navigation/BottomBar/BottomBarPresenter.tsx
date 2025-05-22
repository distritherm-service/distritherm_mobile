import React, { useState, useEffect } from 'react';
import { View, Platform, StyleSheet, Dimensions } from 'react-native';
import { 
  faHome, 
  faSearch, 
  faHeart, 
  faShoppingCart, 
  faUser,
  faStore
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular,
  faUser as faUserRegular
} from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabItemContainer from './TabItem';
import CurvedBottomBar from './CurvedBottomBar';
import { colors } from '../../utils/colors';
import { moderateScale as ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomBarPresenterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  renderScreen: (tabName: string) => React.ReactNode;
}

const isTablet = Dimensions.get('window').width >= 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
export const ICON_SIZE = ms(isTablet ? 13 : 23);
const BOTTOM_BAR_HEIGHT = ms(60);
const CART_BUTTON_SIZE = ms(60);
const CART_ELEVATION = Platform.OS === 'ios' ? ms(22) : ms(30);

const BottomBarPresenter: React.FC<BottomBarPresenterProps> = ({ 
  activeTab, 
  onTabPress,
  renderScreen
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  
  // État pour les dimensions de l'écran (utile pour la rotation)
  const [dimensions, setDimensions] = useState({ 
    width: SCREEN_WIDTH, 
    height: BOTTOM_BAR_HEIGHT + bottomInset 
  });
  
  // Mise à jour des dimensions en cas de changement d'orientation
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Dimensions.get('window').width,
        height: BOTTOM_BAR_HEIGHT + bottomInset
      });
    };
    
    // Utilisation de l'API moderne pour les écouteurs d'événements
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => {
      subscription.remove();
    };
  }, [bottomInset]);
  
  // Configuration des tabs
  const tabs = [
    { name: 'Home', label: 'Accueil', icon: faHome },
    { name: 'Search', label: 'Recherche', icon: faSearch },
    { name: 'Favorite', label: 'Favoris', icon: activeTab === 'Favorite' ? faHeart : faHeartRegular },
    { name: 'Profil', label: 'Profil', icon: activeTab === 'Profil' ? faUser : faUserRegular }
  ];

  // Séparation de l'onglet Panier pour un traitement spécial
  const cartTab = { name: 'Cart', label: 'Panier', icon: faShoppingCart };
  
  // Exemple de nombre d'articles dans le panier (à remplacer par une vraie logique)
  const cartItemCount = 3;

  return (
    <View style={styles.container}>
      {/* Contenu principal avec padding pour éviter que le contenu ne soit sous le bouton panier */}
      <View style={[styles.content, { paddingBottom: BOTTOM_BAR_HEIGHT + bottomInset }]}>
        {renderScreen(activeTab)}
      </View>

      {/* Barre de navigation avec creux arrondi */}
      <View style={[styles.bottomBarContainer, { height: BOTTOM_BAR_HEIGHT + bottomInset }]}>
        {/* Fond de la barre avec creux */}
        <CurvedBottomBar
          width={dimensions.width}
          height={dimensions.height}
          color={colors.secondary[400]}
          cartButtonSize={CART_BUTTON_SIZE}
        />
        
        {/* Contenu de la barre de navigation */}
        <View style={[styles.bottomBarContent, { paddingBottom: bottomInset }]}>
          {/* Première moitié des onglets */}
          <View style={styles.tabGroup}>
            {tabs.slice(0, 2).map((tab) => (
              <TabItemContainer
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
              <TabItemContainer
                key={tab.name}
                icon={tab.icon as IconProp}
                label={tab.label}
                isActive={activeTab === tab.name}
                onPress={() => onTabPress(tab.name)}
              />
            ))}
          </View>
        </View>
        
        {/* Bouton panier flottant */}
        <View style={styles.cartButtonContainer}>
          <TabItemContainer
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarContent: {
    flexDirection: 'row',
    height: BOTTOM_BAR_HEIGHT,
    paddingTop: ms(10),
  },
  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  centerSpace: {
    width: CART_BUTTON_SIZE + ms(10),
  },
  cartButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -CART_ELEVATION - ms(2) : -CART_ELEVATION,
    alignSelf: 'center',
    zIndex: 10,
    width: CART_BUTTON_SIZE,
    height: CART_BUTTON_SIZE,
  },
  cartIconContainer: {
    width: CART_BUTTON_SIZE,
    height: CART_BUTTON_SIZE,
    borderRadius: CART_BUTTON_SIZE / 2,
    backgroundColor: colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.tertiary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.primary[50],
  },
  cartLabelContainer: {
    display: 'none', // On cache le label pour un design plus épuré
  },
  cartLabel: {
    fontSize: ms(9),
    fontWeight: 'bold',
    color: colors.primary[50],
  },
});

export default BottomBarPresenter; 