import React from "react";
import PageStylePresenter from "./PageStylePresenter";
import { ms } from "react-native-size-matters";
import { User } from "src/types/User";
import { Platform } from "react-native";
import { isTablet } from "src/utils/deviceUtils";

interface PageStyleProps {
  children?: React.ReactNode;
  user?: User | null;
  isAuthenticated?: boolean;
}

const PageStyle: React.FC<PageStyleProps> = ({
  children,
  user,
  isAuthenticated,
}) => {
  const heightPercentage = isAuthenticated
    ? Platform.OS == "ios"
      ? 0.20
      : 0.20
    : Platform.OS == "ios"
    ? 0.57
    : 0.61;
  const imageHeight = isAuthenticated
    ? ms(80)
    : Platform.OS == "android"
    ? ms(255)
    : ms(220);
  const imageWidth = isAuthenticated
    ? ms(80)
    : Platform.OS == "android"
    ? ms(255)
    : ms(220);

  const logoSize = {
    width: imageWidth || ms(100),
    height: imageHeight || ms(100),
  };

  const handleImagePress = () => {
    console.log("Profile image pressed");

  }

  return (
    <PageStylePresenter
      user={isAuthenticated && user ? user : undefined}
      heightPercentage={heightPercentage}
      logoSize={logoSize}
      handleImagePress={handleImagePress}
    >
      {children}
    </PageStylePresenter>
  );
};

export default PageStyle;
