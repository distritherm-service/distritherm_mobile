import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../../utils/colors';
import { CalculatedBarProps } from './CurvedBottomBar';

const CurvedBottomBarPresenter: React.FC<CalculatedBarProps> = ({
  width,
  height,
  color,
  path
}) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.secondary[500]} stopOpacity="1" />
            <Stop offset="1" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={path}
          fill="url(#barGradient)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8, // Pour Android
  },
});

export default CurvedBottomBarPresenter; 