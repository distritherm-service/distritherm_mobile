import { useEffect, useState } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';

interface KeyboardState {
  keyboardShown: boolean;
  keyboardHeight: number;
  keyboardAnimationDuration?: number;
}

/**
 * Hook personnalisé pour une détection fiable du clavier
 * Basé sur les meilleures pratiques pour gérer le clavier avec React Navigation
 */
export const useKeyboard = (): KeyboardState => {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    keyboardShown: false,
    keyboardHeight: 0,
    keyboardAnimationDuration: 250,
  });

  useEffect(() => {
    console.log('🎹 useKeyboard hook initialized on platform:', Platform.OS);
    
    // Utiliser les événements appropriés selon la plateforme
    // Essayons aussi keyboardDidShow sur iOS comme fallback
    const showEvent = Platform.OS === 'ios' ? 'keyboardDidShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardDidHide' : 'keyboardDidHide';
    
    console.log('🎹 Using events:', { showEvent, hideEvent });

    const onKeyboardShow = (e: KeyboardEvent) => {
      const keyboardHeight = e.endCoordinates?.height || 0;
      const animationDuration = Platform.OS === 'ios' ? (e.duration || 250) : 250;
      
      console.log('🎹 Keyboard Show:', { keyboardHeight, animationDuration, platform: Platform.OS });
      
      // Filtrer les faux positifs (hauteur trop petite)
      if (keyboardHeight > 0) {
        console.log('✅ Keyboard detected - hiding bottom bar');
        setKeyboardState({
          keyboardShown: true,
          keyboardHeight,
          keyboardAnimationDuration: animationDuration,
        });
      } else {
        console.log('❌ Keyboard height too small:', keyboardHeight);
      }
    };

    const onKeyboardHide = (e: KeyboardEvent) => {
      const animationDuration = Platform.OS === 'ios' ? (e.duration || 250) : 250;
      console.log('🎹 Keyboard Hide:', { animationDuration, platform: Platform.OS });
      setKeyboardState({
        keyboardShown: false,
        keyboardHeight: 0,
        keyboardAnimationDuration: animationDuration,
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  return keyboardState;
};