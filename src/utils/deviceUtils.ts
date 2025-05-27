import { Dimensions, Platform } from 'react-native';

/**
 * Détecte si l'appareil est une tablette
 * Utilise plusieurs critères pour une détection plus précise
 */
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  
  // Critères de détection
  const minTabletWidth = 768;
  const minTabletHeight = 1024;
  const maxPhoneAspectRatio = 2.1; // Les téléphones ont généralement un ratio plus élevé
  
  // Sur iOS, on peut utiliser des critères plus spécifiques
  if (Platform.OS === 'ios') {
    // iPad detection basée sur les dimensions communes
    const isIPadSize = (width >= minTabletWidth && height >= minTabletHeight) ||
                      (height >= minTabletWidth && width >= minTabletHeight);
    
    // Vérification du ratio d'aspect (les iPads ont généralement un ratio plus carré)
    const hasTabletAspectRatio = aspectRatio <= maxPhoneAspectRatio && aspectRatio >= (1 / maxPhoneAspectRatio);
    
    return isIPadSize && hasTabletAspectRatio;
  }
  
  // Sur Android, détection basée principalement sur la largeur
  const largerDimension = Math.max(width, height);
  const smallerDimension = Math.min(width, height);
  
  // Une tablette Android a généralement au moins 600dp de largeur en mode portrait
  const isAndroidTabletSize = smallerDimension >= 600;
  
  // Vérification additionnelle du ratio d'aspect
  const currentAspectRatio = largerDimension / smallerDimension;
  const hasReasonableAspectRatio = currentAspectRatio <= maxPhoneAspectRatio;
  
  return isAndroidTabletSize && hasReasonableAspectRatio;
};

/**
 * Obtient le type d'appareil sous forme de string
 */
export const getDeviceType = (): 'phone' | 'tablet' => {
  return isTablet() ? 'tablet' : 'phone';
};

/**
 * Obtient les dimensions de l'écran avec des informations supplémentaires
 */
export const getScreenInfo = () => {
  const { width, height } = Dimensions.get('window');
  const screenData = Dimensions.get('screen');
  
  return {
    window: { width, height },
    screen: screenData,
    isTablet: isTablet(),
    deviceType: getDeviceType(),
    aspectRatio: width / height,
    isLandscape: width > height,
    isPortrait: height > width,
  };
};

/**
 * Hook-like function pour obtenir les informations d'écran
 * (peut être utilisé dans les composants fonctionnels)
 */
export const useScreenInfo = () => {
  return getScreenInfo();
}; 