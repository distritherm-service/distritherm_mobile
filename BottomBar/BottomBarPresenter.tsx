import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard, Dimensions, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { ms } from 'react-native-size-matters';
import colors from '../../utils/colors';
import { BOTTOM_BAR_HEIGHT, ICON_SIZE, FLOATING_BUTTON_SIZE, TAB_LABEL_FONT_SIZE, FLOATING_BUTTON_ICON_SIZE, IS_TABLET, FLOATING_BUTTON_TABLET_PADDING } from './constants';

interface TabItemProps {
  name: string;
  label: string;
  icon: string;
}

interface BottomBarPresenterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  onCreateAnnonce: () => void;
  renderScreen: () => React.ReactNode;
}

// Élévation du bouton comme dans mobile-ds avec ms
const BUTTON_ELEVATION = Platform.OS === 'ios' ? ms(22) : ms(30);

const BottomBarPresenter: React.FC<BottomBarPresenterProps> = ({
  activeTab,
  onTabPress,
  onCreateAnnonce,
  renderScreen,
}) => {
  const insets = useSafeAreaInsets();
  const [screenHeight] = useState(Dimensions.get('window').height);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const bottomBarTranslateY = useState(new Animated.Value(0))[0];

  // Gérer l'état du clavier avec animation fluide
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Animation vers le bas pour cacher
      Animated.timing(bottomBarTranslateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      // Animation vers le haut pour afficher
      Animated.timing(bottomBarTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [bottomBarTranslateY]);
  
  const tabs: TabItemProps[] = [
    { name: 'Home', label: 'Accueil', icon: 'home' },
    { name: 'Search', label: 'Recherche', icon: 'search' },
    { name: 'Favorites', label: 'Favoris', icon: 'heart' },
    { name: 'Profile', label: 'Profil', icon: 'user' },
  ];

  // Calculer le paddingBottom avec maximum ms(2) d'écart
  const bottomPadding = Platform.OS === 'ios' 
    ? Math.max(insets.bottom, ms(2))
    : Math.max(insets.bottom, ms(2));

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dominant.primary,
      // Empêcher tout redimensionnement lors de l'apparition du clavier
      position: 'relative',
    },
    bottomBarContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: bottomPadding,
      // Force la position fixe même avec le clavier
      ...(Platform.OS === 'android' && {
        position: 'absolute',
        bottom: 0,
        elevation: 1000,
      }),
      ...(Platform.OS === 'ios' && {
        position: 'absolute',
        bottom: 0,
        zIndex: 1000,
      }),
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Contenu principal avec protection clavier */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Bar - Avec animation fluide */}
      <Animated.View 
        style={[
          styles.bottomBarContainer, 
          dynamicStyles.bottomBarContainer,
          {
            transform: [{ translateY: bottomBarTranslateY }],
          }
        ]}
        pointerEvents={keyboardVisible ? "none" : "box-none"}
      >
        
        <View style={styles.bottomBar}>
          {/* Onglets à gauche */}
          <View style={styles.tabGroup}>
            {tabs.slice(0, 2).map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => onTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome 
                    name={tab.icon as any} 
                    size={ICON_SIZE} 
                    color={colors.text.inverse}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.name && styles.tabLabelActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Espace central pour le bouton flottant */}
          <View style={styles.centerSpace} />

          {/* Onglets à droite */}
          <View style={styles.tabGroup}>
            {tabs.slice(2).map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => onTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome 
                    name={tab.icon as any} 
                    size={ICON_SIZE} 
                    color={colors.text.inverse}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.name && styles.tabLabelActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bouton flottant central avec design premium */}
        <View style={styles.floatingButtonContainer}>
          <View style={styles.floatingButtonShadow}>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={onCreateAnnonce}
              activeOpacity={0.8}
            >
              <View style={styles.floatingButtonInner}>
                                  <FontAwesome 
                    name="plus" 
                    size={ms(FLOATING_BUTTON_ICON_SIZE)} 
                    color={colors.accent.primary}
                  />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant.primary,
  },
  content: {
    flex: 1,
    // Ajouter un paddingBottom pour éviter que le contenu soit masqué par le BottomBar
    paddingBottom: BOTTOM_BAR_HEIGHT + (Platform.OS === 'ios' ? ms(34) : ms(28)),
  },
  bottomBarContainer: {
    backgroundColor: colors.accent.primary,
    paddingTop: IS_TABLET ? ms(6) : ms(4),
    // paddingBottom sera géré dynamiquement par useSafeAreaInsets
    borderTopWidth: 0,
    shadowColor: colors.effects?.shadowStrong || colors.shadow,
    shadowOffset: {
      width: 0,
      height: ms(-6),
    },
    shadowOpacity: 0.08,
    shadowRadius: ms(12),
    elevation: 1000, // Élévation maximale pour Android
    overflow: 'visible',
    // Configuration renforcée pour empêcher le mouvement avec le clavier
    ...Platform.select({
      android: {
        // Configuration Android pour résister au clavier
        elevation: 1000,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      },
      ios: {
        // Configuration iOS pour résister au clavier
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      },
    }),
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: IS_TABLET ? ms(24) : ms(20),
    height: BOTTOM_BAR_HEIGHT,
  },
  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: IS_TABLET ? 'space-evenly' : 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_TABLET ? ms(5) : ms(6),
    paddingHorizontal: IS_TABLET ? ms(8) : ms(8),
    borderRadius: ms(12),
    minWidth: IS_TABLET ? ms(70) : ms(48),
    maxWidth: IS_TABLET ? ms(90) : undefined,
    overflow: 'visible',
  },
  iconContainer: {
    marginBottom: IS_TABLET ? ms(3) : ms(2),
    padding: IS_TABLET ? ms(2) : ms(2),
    borderRadius: ms(6),
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: ms(TAB_LABEL_FONT_SIZE),
    color: colors.text.inverse,
    fontWeight: '500',
    opacity: 0.9,
  },
  tabLabelActive: {
    color: colors.text.inverse,
    fontWeight: '700',
    opacity: 1,
  },
  centerSpace: {
    width: IS_TABLET ? FLOATING_BUTTON_SIZE + ms(20) : FLOATING_BUTTON_SIZE + ms(FLOATING_BUTTON_TABLET_PADDING),
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (IS_TABLET ? -ms(32) - ms(6) : -BUTTON_ELEVATION - ms(5)) : (IS_TABLET ? -ms(40) + ms(4) : -BUTTON_ELEVATION + ms(3)),
    left: '50%',
    marginLeft: -(FLOATING_BUTTON_SIZE / 2),
    zIndex: 10,
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    backgroundColor: 'transparent',
  },
  floatingButtonShadow: {
    shadowColor: colors.accent.primary,
    shadowOffset: { 
      width: 0, 
      height: ms(6) 
    },
    shadowOpacity: 0.2,
    shadowRadius: ms(12),
    elevation: 12,
  },
  floatingButton: {
    width: FLOATING_BUTTON_SIZE + ms(2),
    height: FLOATING_BUTTON_SIZE + ms(2),
    borderRadius: (FLOATING_BUTTON_SIZE + ms(2)) / 2,
    backgroundColor: colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  floatingButtonInner: {
    width: FLOATING_BUTTON_SIZE - ms(2),
    height: FLOATING_BUTTON_SIZE - ms(2),
    borderRadius: (FLOATING_BUTTON_SIZE - ms(2)) / 2,
    backgroundColor: colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.primary,
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.12,
    shadowRadius: ms(4),
    elevation: 4,
  },
});

export default BottomBarPresenter; 