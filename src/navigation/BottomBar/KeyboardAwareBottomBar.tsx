import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Animated } from 'react-native';

interface KeyboardAwareBottomBarProps {
  children: React.ReactNode;
  bottomBarHeight: number;
  bottomInset: number;
}

/**
 * Composant wrapper qui cache automatiquement la bottom bar quand le clavier apparaît
 * Solution alternative basée sur les recommandations de l'article Reddit
 */
const KeyboardAwareBottomBar: React.FC<KeyboardAwareBottomBarProps> = ({
  children,
  bottomBarHeight,
  bottomInset,
}) => {
  const [translateY] = useState(new Animated.Value(0));
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    console.log('🔧 KeyboardAwareBottomBar: Setting up simple keyboard listeners');

    const handleKeyboardShow = (e: any) => {
      const height = e.endCoordinates?.height || 0;
      console.log('🎹 SIMPLE: Keyboard show detected', { height });
      
      setKeyboardHeight(height);
      Animated.timing(translateY, {
        toValue: bottomBarHeight + bottomInset + 10, // Extra 10px pour être sûr
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ SIMPLE: Bottom bar hidden');
      });
    };

    const handleKeyboardHide = () => {
      console.log('🎹 SIMPLE: Keyboard hide detected');
      setKeyboardHeight(0);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ SIMPLE: Bottom bar shown');
      });
    };

    // Version simplifiée - un seul événement par plateforme
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      console.log('🔧 KeyboardAwareBottomBar: Cleaning up simple listeners');
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, [translateY, bottomBarHeight, bottomInset]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
      }}
      pointerEvents={keyboardHeight > 0 ? "none" : "box-none"}
    >
      {children}
    </Animated.View>
  );
};

export default KeyboardAwareBottomBar;