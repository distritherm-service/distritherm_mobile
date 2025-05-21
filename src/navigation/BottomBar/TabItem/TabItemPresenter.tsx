import React from 'react';
import { Pressable, Text, Animated, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { moderateScale as ms } from 'react-native-size-matters';
import { colors } from '../../../utils/colors';
import { ICON_SIZE } from '../BottomBarPresenter';

interface TabItemPresenterProps {
  icon: IconProp;
  label: string;
  isActive: boolean;
  onPress: () => void;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
  indicatorAnim: Animated.Value;
  rippleAnim: Animated.Value;
  handlePress: () => void;
  isCartTab?: boolean;
  customIconStyle?: ViewStyle;
  customLabelStyle?: ViewStyle;
  customTextStyle?: TextStyle;
}

const TabItemPresenter: React.FC<TabItemPresenterProps> = ({
  icon,
  label,
  isActive,
  scaleAnim,
  opacityAnim,
  rippleAnim,
  handlePress,
  isCartTab = false,
  customIconStyle,
  customLabelStyle,
  customTextStyle
}) => {
  if (isCartTab) {
    return (
      <Pressable onPress={handlePress}>
        <Animated.View 
          style={[
            customIconStyle,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <FontAwesomeIcon 
            icon={icon} 
            size={ms(ICON_SIZE * 1.2)}
            color={isActive ? colors.secondary[400] : colors.primary[700]} 
          />
        </Animated.View>

        <Animated.View style={[customLabelStyle]}>
          <Text 
            style={[customTextStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={[styles.tabItem, isActive && styles.tabItemActive]} 
      onPress={handlePress}
    >
      {/* Effet de ripple */}
      <Animated.View 
        style={[
          {
            opacity: rippleAnim.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 0.12, 0]
            }),
            transform: [
              { 
                scale: rippleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5]
                }) 
              }
            ]
          }
        ]} 
      />

      {/* Conteneur d'icône */}
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim
          }
        ]}
      >
        <FontAwesomeIcon 
          icon={icon} 
          size={ms(ICON_SIZE * (isActive ? 0.85 : 0.75))}
          color={isActive ? styles.labelActive.color : styles.label.color} 
        />
      </Animated.View>

      {/* Conteneur de label */}
      <View style={styles.labelContainer}>
        <Text 
          style={[styles.label, isActive && styles.labelActive]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default TabItemPresenter; 