import React, { useRef, useEffect } from 'react';
import { Animated, Easing, ViewStyle, TextStyle } from 'react-native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import TabItemPresenter from './TabItemPresenter';

interface TabItemProps {
  icon: IconProp;
  label: string;
  isActive: boolean;
  onPress: () => void;
  isCartTab?: boolean;
  customIconStyle?: ViewStyle;
  customLabelStyle?: ViewStyle;
  customTextStyle?: TextStyle;
  badgeCount?: number;
  hasEmailWarning?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ 
  icon, 
  label, 
  isActive, 
  onPress, 
  isCartTab = false,
  customIconStyle,
  customLabelStyle,
  customTextStyle,
  badgeCount = 0,
  hasEmailWarning = false
}) => {
  // Animation references
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  // Handle animations when active state changes
  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isActive, scaleAnim, opacityAnim]);

  // Handle press with ripple animation
  const handlePress = () => {
    // Animation de ripple au clic
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    onPress();
  };

  return (
    <TabItemPresenter
      icon={icon}
      label={label}
      isActive={isActive}
      onPress={onPress}
      scaleAnim={scaleAnim}
      opacityAnim={opacityAnim}
      indicatorAnim={indicatorAnim}
      rippleAnim={rippleAnim}
      handlePress={handlePress}
      isCartTab={isCartTab}
      customIconStyle={customIconStyle}
      customLabelStyle={customLabelStyle}
      customTextStyle={customTextStyle}
      badgeCount={badgeCount}
      hasEmailWarning={hasEmailWarning}
    />
  );
};

export default TabItem; 