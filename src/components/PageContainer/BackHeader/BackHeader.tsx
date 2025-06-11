import React from "react";
import { useNavigation } from "@react-navigation/native";
import BackHeaderPresenter from "./BackHeaderPresenter";

interface BackHeaderProps {
  title?: string;
  onCustomBack?: () => void;
  hideBackButton?: boolean;
  titleLeft?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({ 
  title,
  onCustomBack,
  hideBackButton = false,
  titleLeft = false
}) => {
  const navigation = useNavigation();
  
  const handleBackPress = () => {
    if (onCustomBack) {
      onCustomBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <BackHeaderPresenter
      title={title}
      onBackPress={handleBackPress}
      hideBackButton={hideBackButton}
      titleLeft={titleLeft}
    />
  );
};

export default BackHeader;
