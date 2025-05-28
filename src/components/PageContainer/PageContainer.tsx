import React from "react";
import { ViewStyle } from "react-native";
import BackHeader from "./BackHeader/BackHeader";
import PageContainerPresenter from "./PageContainerPresenter";

interface PageContainerProps {
  headerBack?: boolean;
  headerTitle?: string;
  onCustomBack?: () => void;
  hideBackButton?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  isScrollable?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  headerBack = false,
  headerTitle,
  onCustomBack,
  hideBackButton = false,
  children,
  style,
  contentStyle,
  isScrollable = false,
}) => {
  // Création du composant d'en-tête si nécessaire
  const headerComponent = headerBack ? (
    <BackHeader 
      title={headerTitle} 
      onCustomBack={onCustomBack}
      hideBackButton={hideBackButton}
    />
  ) : null;

  return (
    <PageContainerPresenter
      headerComponent={headerComponent}
      style={style}
      contentStyle={contentStyle}
      isScrollable={isScrollable}
    >
      {children}
    </PageContainerPresenter>
  );
};

export default PageContainer;
