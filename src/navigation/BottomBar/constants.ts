import { Dimensions } from 'react-native';
import { moderateScale as ms } from 'react-native-size-matters';
import { isTablet } from 'src/utils/deviceUtils';

// Détection des appareils tablette
export const SCREEN_WIDTH = Dimensions.get('window').width;

// Tailles communes utilisées dans le bottomBar
export const ICON_SIZE = ms(isTablet() ? 13 : 23);
export const BOTTOM_BAR_HEIGHT = ms(60);
export const CART_BUTTON_SIZE = ms(50); 