import React from 'react';
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
import { colors } from '../../utils/colors';
import { moderateScale as ms } from 'react-native-size-matters';

interface BottomBarPresenterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  renderScreen: (tabName: string) => React.ReactNode;
}

const isTablet = Dimensions.get('window').width >= 768;
export const ICON_SIZE = ms(isTablet ? 13 : 23);

const BottomBarPresenter: React.FC<BottomBarPresenterProps> = ({ 
  activeTab, 
  onTabPress,
  renderScreen
}) => {
  // Configuration des tabs
  const tabs = [
    { name: 'Home', label: 'Accueil', icon: faHome },
    { name: 'Search', label: 'Recherche', icon: faSearch },
    { name: 'Favorite', label: 'Favoris', icon: activeTab === 'Favorite' ? faHeart : faHeartRegular },
    { name: 'Profil', label: 'Profil', icon: activeTab === 'Profil' ? faUser : faUserRegular }
  ];

  // Séparation de l'onglet Panier pour un traitement spécial
  const cartTab = { name: 'Cart', label: 'Panier', icon: faShoppingCart };

  return (
    <View style={styles.container}>
      {/* Contenu principal */}
      <View style={styles.content}>
        {renderScreen(activeTab)}
      </View>

      {/* Barre de navigation avec SafeAreaView optimisé */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: styles.bottomBar.backgroundColor }}>
        <View style={styles.bottomBar}>
          {/* Première moitié des onglets */}
          {tabs.slice(0, 2).map((tab) => (
            <TabItemContainer
              key={tab.name}
              icon={tab.icon as IconProp}
              label={tab.label}
              isActive={activeTab === tab.name}
              onPress={() => onTabPress(tab.name)}
            />
          ))}
          
          {/* Onglet Panier au centre avec style spécial */}
          <View style={styles.cartTabItem}>
            <TabItemContainer
              key={cartTab.name}
              icon={cartTab.icon as IconProp}
              label={cartTab.label}
              isActive={activeTab === cartTab.name}
              onPress={() => onTabPress(cartTab.name)}
              isCartTab={true}
              customIconStyle={styles.cartIconContainer}
              customLabelStyle={styles.cartLabelContainer}
              customTextStyle={styles.cartLabel}
            />
          </View>
          
          {/* Seconde moitié des onglets */}
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.primary[50],
    paddingBottom: Platform.OS === 'ios' ? ms(12) : ms(4),
    paddingTop: ms(4),
    borderTopWidth: 1,
    borderTopColor: colors.primary[100],
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(2),
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'transparent',
  },
  // Styles spécifiques pour l'onglet Panier
  cartTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(2),
    position: 'relative',
    flex: 1,
  },
  cartIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ms(50),
    height: ms(50),
    backgroundColor: colors.primary[50],
    borderRadius: ms(25),
    position: 'absolute',
    bottom: ms(10),
    left: '50%',
    transform: [{ translateX: ms(-25) }],
    shadowColor: colors.tertiary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ms(22),
    height: ms(22),
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(1),
  },
  cartLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: ms(-25) }],
    width: ms(50),
  },
  label: {
    fontSize: ms(8),
    fontWeight: '500',
    color: colors.primary[700],
    textAlign: 'center',
  },
  labelActive: {
    fontSize: ms(9),
    fontWeight: 'bold',
    color: colors.secondary[400],
  },
  cartLabel: {
    fontSize: ms(9),
    fontWeight: 'bold',
    color: colors.primary[700],
  },
  content: {
    flex: 1,
  }
});

export default BottomBarPresenter; 