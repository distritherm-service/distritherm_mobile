import React from 'react';
import SpacerPresenter from './SpacerPresenter';
import { ms } from 'react-native-size-matters';

interface SpacerProps {
  height?: number;
}

const Spacer: React.FC<SpacerProps> = ({
  height
}) => {
  const spacerHeight = height !== undefined ? ms(height) : ms(50);

  return (
    <SpacerPresenter height={spacerHeight} />
  );
};

export default Spacer;