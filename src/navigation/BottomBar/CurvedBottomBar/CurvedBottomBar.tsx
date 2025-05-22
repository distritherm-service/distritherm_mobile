import React from 'react';
import CurvedBottomBarPresenter from './CurvedBottomBarPresenter';
import { moderateScale as ms } from 'react-native-size-matters';

export interface CurvedBottomBarProps {
  width: number;
  height: number;
  color: string;
  cartButtonSize: number;
}

export interface CalculatedBarProps {
  width: number;
  height: number;
  color: string;
  path: string;
}

const CurvedBottomBar: React.FC<CurvedBottomBarProps> = (props) => {
  const { width, height, color, cartButtonSize } = props;
  
  // Paramètres de la courbe
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
  
  // Propriétés calculées à passer au Presenter
  const calculatedProps: CalculatedBarProps = {
    width,
    height,
    color,
    path
  };
  
  return <CurvedBottomBarPresenter {...calculatedProps} />;
};

export default CurvedBottomBar;