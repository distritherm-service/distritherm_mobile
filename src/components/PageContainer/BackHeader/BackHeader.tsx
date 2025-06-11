import React from "react";
import { useNavigation } from "@react-navigation/native";
import BackHeaderPresenter from "./BackHeaderPresenter";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BackHeaderProps {
  title?: string;
  onCustomBack?: () => void;
  hideBackButton?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({ 
  title,
  onCustomBack,
  hideBackButton = false
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
    />
  );
};

export default BackHeader;
