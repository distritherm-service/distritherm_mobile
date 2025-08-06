import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { ms } from 'react-native-size-matters';
import colors from '../src/utils/colors';
import { BOTTOM_BAR_HEIGHT, ICON_SIZE, FLOATING_BUTTON_SIZE, TAB_LABEL_FONT_SIZE, FLOATING_BUTTON_ICON_SIZE, IS_TABLET, FLOATING_BUTTON_TABLET_PADDING } from './constants';
import {
  Home as HomeScreen,
  Search as SearchScreen,
  Favorite as FavoritesScreen,
  Profil as ProfileScreen,
  PersonalInformation as InformationsPersonnellesScreen,
  ForgotPassword as MotDePasseScreen,
  Product as AnnonceDetailsScreen
} from '../src/screens';
import { SearchParams } from '../src/navigation/types';
import { useAppStore } from '../src/store/store';

interface BottomBarProps {
  initialTab?: string;
  searchParams?: SearchParams;
  onLogout?: () => void;
  onNavigateToAuth?: (screen: 'Login' | 'Register') => void;
  startOnProfile?: boolean;
}

/**
 * Container component for BottomBar
 * Handles business logic, data fetching, and state management
 */
const BottomBar: React.FC<BottomBarProps> = ({ 
  initialTab = 'Home', 
  searchParams, 
  onLogout, 
  onNavigateToAuth,
  startOnProfile = false 
}) => {
  const [activeTab, setActiveTab] = useState(startOnProfile ? 'Profile' : 'Home'); // Toujours démarrer sur Home sauf si explicitement demandé
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | undefined>(searchParams);
  const [navigationStack, setNavigationStack] = useState<string[]>([]);
  const { state } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleTabPress = useCallback((tabName: string) => {
    // Réinitialiser les searchParams quand on quitte Search
    if (tabName !== 'Search') {
      setCurrentSearchParams(undefined);
    }
    // Clear navigation stack when switching main tabs
    setNavigationStack([]);
    setActiveTab(tabName);
  }, []);

  const handleCreateAnnonce = useCallback(() => {
    setNavigationStack([]);
    setActiveTab('CreateAnnonce');
  }, []);

  // Function to navigate to auth - now uses the prop from parent
  const navigateToAuth = useCallback((screen: 'Login' | 'Register') => {
    if (onNavigateToAuth) {
      onNavigateToAuth(screen);
    } else {
      // Fallback to logout if onNavigateToAuth is not provided
      onLogout?.();
    }
  }, [onNavigateToAuth, onLogout]);

  // Function to navigate to search with parameters
  const navigateToSearch = useCallback((params: SearchParams) => {
    setCurrentSearchParams(params);
    setActiveTab('Search');
  }, []);

  // Function to navigate to sub-screens
  const navigateToScreen = useCallback((screenName: string, params?: any) => {
    setNavigationStack(prev => [...prev, activeTab]);
    setNavigationParams(params);
    setActiveTab(screenName);
  }, [activeTab]);
  


  // Navigation parameters state
  const [navigationParams, setNavigationParams] = useState<any>(undefined);

  // Function to get navigation parameters
  const getNavigationParams = useCallback(() => {
    return navigationParams;
  }, [navigationParams]);

  // Function to navigate to Password with provider check
  const navigateToPassword = useCallback(() => {
    // Check from store if we have user info
    const { user } = state.user;
    
    const isProvider = user?.type === 'PROVIDER';
    
    if (isProvider) {
      Alert.alert(
        'Fonctionnalité non disponible',
        'La modification du mot de passe n\'est pas disponible pour les comptes connectés via un provider.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigateToScreen('Password');
  }, [state, navigateToScreen]);

  // Function to go back
  const goBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const previousScreen = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setNavigationParams(undefined); // Clear params when going back
      setActiveTab(previousScreen);
    }
  }, [navigationStack]);

  // Rendu des écrans en fonction de l'onglet actif
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen 
          onNavigateToSearch={navigateToSearch}
        />;
      case 'Search':
        return <SearchScreen />;
      case 'Favorites':
                return <FavoritesScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'CreateAnnonce':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>Créer une annonce - À venir</Text>
            <TouchableOpacity 
              onPress={() => setActiveTab('Home')}
              style={{ marginTop: 20, padding: 10, backgroundColor: colors.secondary[400], borderRadius: 5 }}
            >
              <Text style={{ color: colors.text }}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </View>
        );
      case 'PersonalInfo':
        return <InformationsPersonnellesScreen />;
      case 'Password':
        return <MotDePasseScreen />;
      case 'MyAnnonces':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>Mes annonces - À venir</Text>
            <TouchableOpacity 
              onPress={goBack}
              style={{ marginTop: 20, padding: 10, backgroundColor: colors.secondary[400], borderRadius: 5 }}
            >
              <Text style={{ color: colors.text }}>Retour</Text>
            </TouchableOpacity>
          </View>
        );
      case 'ModificationAnnonce':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>Modification d'annonce - À venir</Text>
            <TouchableOpacity 
              onPress={goBack}
              style={{ marginTop: 20, padding: 10, backgroundColor: colors.secondary[400], borderRadius: 5 }}
            >
              <Text style={{ color: colors.text }}>Retour</Text>
            </TouchableOpacity>
          </View>
        );
      case 'AnnonceDetails':
        return <AnnonceDetailsScreen route={{ key: 'Product', name: 'Product', params: { productId: getNavigationParams()?.annonceId || 1 } }} />;
      default:
        return <HomeScreen 
          onNavigateToSearch={navigateToSearch}
        />;
    }
  };

  // Élévation du bouton comme dans mobile-ds avec ms
  const BUTTON_ELEVATION = Platform.OS === 'ios' ? ms(22) : ms(30);

  const tabs = [
    { name: 'Home', label: 'Accueil', icon: 'home' },
    { name: 'Search', label: 'Recherche', icon: 'search' },
    { name: 'Favorites', label: 'Favoris', icon: 'heart' },
    { name: 'Profile', label: 'Profil', icon: 'user' },
  ];

  // Don't show bottom bar for sub-screens
  const isSubScreen = ['PersonalInfo', 'Password', 'MyAnnonces', 'ModificationAnnonce', 'AnnonceDetails'].includes(activeTab);

  return (
    <View style={styles.container}>
      {/* Contenu principal avec KeyboardAvoidingView pour gérer les inputs */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' && !isSubScreen ? BOTTOM_BAR_HEIGHT + (insets.bottom || 0) : 0}
      >
        <View style={styles.content}>
          {renderScreen()}
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Bar - Hidden for sub-screens, Position absolue fixe */}
      {!isSubScreen && (
        <View style={[styles.bottomBarContainer, { paddingBottom: insets.bottom > 0 ? ms(12) : ms(2) }]}>
          
          <View style={styles.bottomBar}>
            {/* Premier onglet */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                { opacity: activeTab === 'Home' ? 1 : 0.7 }
              ]}
              onPress={() => handleTabPress('Home')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <FontAwesome 
                  name="home" 
                  size={activeTab === 'Home' ? ICON_SIZE : ms(ICON_SIZE * 0.9)} 
                  color={colors.text}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                activeTab === 'Home' && styles.tabLabelActive
              ]}>
                Accueil
              </Text>
            </TouchableOpacity>

            {/* Deuxième onglet */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                { opacity: activeTab === 'Search' ? 1 : 0.7 }
              ]}
              onPress={() => handleTabPress('Search')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <FontAwesome 
                  name="search" 
                  size={activeTab === 'Search' ? ICON_SIZE : ms(ICON_SIZE * 0.9)} 
                  color={colors.text}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                activeTab === 'Search' && styles.tabLabelActive
              ]}>
                Recherche
              </Text>
            </TouchableOpacity>

            {/* Bouton central créer annonce */}
            <TouchableOpacity 
              style={styles.tabItem}
              onPress={handleCreateAnnonce}
              activeOpacity={0.7}
            >
              <View style={styles.createButtonContainer}>
                <View style={styles.createButton}>
                  <FontAwesome 
                    name="plus" 
                    size={ms(FLOATING_BUTTON_ICON_SIZE)} 
                    color={colors.accent[500]}
                  />
                </View>
              </View>
              <Text style={styles.createButtonLabel}>
                Poster
              </Text>
            </TouchableOpacity>

            {/* Quatrième onglet */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                { opacity: activeTab === 'Favorites' ? 1 : 0.7 }
              ]}
              onPress={() => handleTabPress('Favorites')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <FontAwesome 
                  name="heart" 
                  size={activeTab === 'Favorites' ? ICON_SIZE : ms(ICON_SIZE * 0.9)} 
                  color={colors.text}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                activeTab === 'Favorites' && styles.tabLabelActive
              ]}>
                Favoris
              </Text>
            </TouchableOpacity>

            {/* Cinquième onglet */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                { opacity: activeTab === 'Profile' ? 1 : 0.7 }
              ]}
              onPress={() => handleTabPress('Profile')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <FontAwesome 
                  name="user" 
                  size={activeTab === 'Profile' ? ICON_SIZE : ms(ICON_SIZE * 0.9)} 
                  color={colors.text}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                activeTab === 'Profile' && styles.tabLabelActive
              ]}>
                Profil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
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
    backgroundColor: colors.secondary[400],
    paddingTop: IS_TABLET ? ms(3) : ms(2),
    borderTopWidth: 0,
    shadowColor: colors.tertiary[300],
    shadowOffset: {
      width: 0,
      height: ms(-6),
    },
    shadowOpacity: 0.08,
    shadowRadius: ms(12),
    // Configuration pour rester fixe même avec le clavier
    zIndex: 1000,
    elevation: 1000, // pour Android
    overflow: 'visible',
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: IS_TABLET ? ms(16) : ms(12),
    height: BOTTOM_BAR_HEIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_TABLET ? ms(5) : ms(3),
    paddingHorizontal: IS_TABLET ? ms(4) : ms(2),
    maxWidth: IS_TABLET ? ms(80) : ms(65),
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
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontSize: ms(TAB_LABEL_FONT_SIZE + 1),
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createButtonContainer: {
    marginBottom: IS_TABLET ? ms(3) : ms(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    borderRadius: FLOATING_BUTTON_SIZE / 2,
    backgroundColor: colors.tertiary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: ms(2),
    borderColor: colors.secondary[400],
    shadowColor: colors.secondary[400],
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: ms(6),
    elevation: 6,
  },
  createButtonLabel: {
    fontSize: ms(TAB_LABEL_FONT_SIZE + 1),
    color: colors.background,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 1,
  },
});

export default BottomBar; 