import React from 'react';
import { Pressable, Text, Animated, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { moderateScale as ms } from 'react-native-size-matters';
import colors from "src/utils/colors";
import { ICON_SIZE } from '../constants';

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
  badgeCount?: number;
  hasEmailWarning?: boolean;
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
  customTextStyle,
  badgeCount = 0,
  hasEmailWarning = false
}) => {
  if (isCartTab) {
    return (
      <Pressable 
        onPress={handlePress} 
        style={styles.cartButton}
        hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
      >
        <Animated.View 
          style={[
            styles.cartIconWrapper,
            customIconStyle,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <FontAwesomeIcon 
            icon={icon} 
            size={ms(ICON_SIZE * 1.3)}
            color={isActive ? colors.primary[50] : colors.primary[200]} 
          />
          
          {/* Badge de notification */}
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          )}
        </Animated.View>

        {label && (
          <Animated.View style={[styles.labelContainer, customLabelStyle]}>
            <Text 
              style={[styles.label, isActive && styles.labelActive, customTextStyle]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Animated.View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={[styles.tabItem]} 
      onPress={handlePress}
    >
      {/* Effet de ripple */}
      <Animated.View 
        style={[
          styles.rippleEffect,
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
          size={ms(ICON_SIZE * (isActive ? 0.9 : 0.8))}
          color={isActive ? colors.primary[50] : colors.primary[200]} 
        />
        
        {/* Indicateur d'email non vérifié - point d'exclamation jaune */}
        {hasEmailWarning && (
          <View style={styles.emailWarningIndicator}>
            <FontAwesomeIcon 
              icon={faExclamation} 
              size={ms(8)}
              color="#FFA500" 
            />
          </View>
        )}
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
  cartButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ms(24),
    height: ms(24),
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(3),
  },
  label: {
    fontSize: ms(8),
    fontWeight: '500',
    color: colors.primary[200],
    textAlign: 'center',
  },
  labelActive: {
    fontSize: ms(9),
    fontWeight: 'bold',
    color: colors.primary[50],
  },
  rippleEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[50],
    opacity: 0,
    borderRadius: ms(15),
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    backgroundColor: colors.tertiary[500],
    borderWidth: 2,
    borderColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(4),
  },
  badgeText: {
    color: colors.primary[50],
    fontSize: ms(8),
    fontWeight: 'bold',
  },
  emailWarningIndicator: {
    position: 'absolute',
    top: ms(-2),
    right: ms(-2),
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: '#FFA500',
    borderWidth: ms(1),
    borderColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.3,
    shadowRadius: ms(4),
    elevation: 5,
  },
});

export default TabItemPresenter; 