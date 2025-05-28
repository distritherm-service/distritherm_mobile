import React from "react";
import { View } from "react-native";
import { ms } from "react-native-size-matters";

interface SpacerPresenterProps {
  height: number;
}

const SpacerPresenter: React.FC<SpacerPresenterProps> = ({ height }) => {
  return (
    <View
      style={{
        height: height,
      }}
    />
  );
};

export default SpacerPresenter;
