import { Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';

// Dimensions de l'écran
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Déterminer si c'est une tablette
export const IS_TABLET = SCREEN_WIDTH >= 768;

// Tailles du BottomBar - Responsive pour tablette
export const BOTTOM_BAR_HEIGHT = IS_TABLET ? ms(65) : ms(55);
export const ICON_SIZE = IS_TABLET ? ms(32) : ms(26);
export const FLOATING_BUTTON_SIZE = IS_TABLET ? ms(48) : ms(34);

// Espacement et marges - Responsive
export const BOTTOM_TAB_PADDING = IS_TABLET ? ms(20) : ms(14);
export const FLOATING_BUTTON_BOTTOM_OFFSET = IS_TABLET ? ms(14) : ms(7);

// Tailles de police responsive
export const TAB_LABEL_FONT_SIZE = IS_TABLET ? ms(12) : ms(10);
export const FLOATING_BUTTON_ICON_SIZE = IS_TABLET ? ms(30) : ms(23);

// Espacement spécifique pour le bouton flottant sur tablette
export const FLOATING_BUTTON_TABLET_PADDING = IS_TABLET ? ms(22) : ms(18);