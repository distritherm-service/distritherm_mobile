import React from "react";
import { useNavigation } from "@react-navigation/native";
import BackHeaderPresenter from "./BackHeaderPresenter";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BackHeaderProps {
  title?: string;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <BackHeaderPresenter
      title={title}
      onBackPress={handleBackPress}
      insets={insets}
    />
  );
};

export default BackHeader;
