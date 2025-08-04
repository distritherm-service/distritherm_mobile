import { useRef, useState, useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface UseScrollDownOptions {
  threshold?: number;
}

interface UseScrollDownReturn {
  isScrollingDown: boolean;
  scrollY: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

/**
 * Hook personnalisé pour détecter la direction du scroll avec un threshold
 * @param options - Options de configuration
 * @returns Object contenant l'état du scroll et la fonction onScroll
 */
export const useScrollDown = ({ threshold = 5 }: UseScrollDownOptions = {}): UseScrollDownReturn => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const deltaY = currentScrollY - lastScrollY.current;
    
    // Mise à jour de la position Y actuelle
    setScrollY(currentScrollY);
    
    // Ne pas considérer les petits mouvements (inférieurs au threshold)
    if (Math.abs(deltaY) < threshold) {
      return;
    }
    
    // Déterminer la direction du scroll
    const scrollingDown = deltaY > 0 && currentScrollY > threshold;
    
    // Mettre à jour l'état seulement si la direction change
    setIsScrollingDown(prev => {
      if (prev !== scrollingDown) {
        return scrollingDown;
      }
      return prev;
    });
    
    // Sauvegarder la position actuelle pour la prochaine comparaison
    lastScrollY.current = currentScrollY;
  }, [threshold]);

  return {
    isScrollingDown,
    scrollY,
    onScroll,
  };
};