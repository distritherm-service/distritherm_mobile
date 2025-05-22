import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { moderateScale as ms } from 'react-native-size-matters';
import { colors } from '../../utils/colors';

interface CurvedBottomBarProps {
  width: number;
  height: number;
  color: string;
  cartButtonSize: number;
}

const CurvedBottomBar: React.FC<CurvedBottomBarProps> = ({
  width,
  height,
  color,
  cartButtonSize
}) => {
  // Paramètres de la courbe
  const circleRadius = cartButtonSize / 2;
  const curveDepth = ms(25); // Profondeur du creux
  const curveWidth = cartButtonSize + ms(35); // Largeur du creux
  
  // Points de contrôle pour la courbe
  const circleCenter = width / 2;
  const leftCurveStart = circleCenter - curveWidth / 2;
  const rightCurveEnd = circleCenter + curveWidth / 2;
  
  // Construction du chemin SVG pour une courbe en haut
  const path = `
    M0,0
    H${leftCurveStart}
    C${leftCurveStart + curveWidth / 6},0 ${leftCurveStart + curveWidth / 4},${curveDepth} ${circleCenter},${curveDepth}
    C${rightCurveEnd - curveWidth / 4},${curveDepth} ${rightCurveEnd - curveWidth / 6},0 ${rightCurveEnd},0
    H${width}
    V${height}
    H0
    Z
  `;

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

export default CurvedBottomBar; 