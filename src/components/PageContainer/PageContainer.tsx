import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import BackHeader from "./BackHeader/BackHeader";
import PageContainerPresenter from "./PageContainerPresenter";

interface PageContainerProps {
  headerBack?: boolean;
  headerTitle?: string;
  children: React.ReactNode;
  style?: object;
  contentStyle?: object;
}

const PageContainer: React.FC<PageContainerProps> = ({
  headerBack,
  headerTitle,
  children,
  style,
  contentStyle,
}) => {
  const insets = useSafeAreaInsets();

  // Calcul des valeurs nécessaires
  const bottomPadding = insets.bottom;
  const topPadding = !headerBack ? insets.top : ms(20);
  const headerComponent = headerBack ? <BackHeader title={headerTitle} /> : null;

  return (
    <PageContainerPresenter
      headerComponent={headerComponent}
      style={style}
      contentStyle={contentStyle}
      bottomPadding={bottomPadding}
      topPadding={topPadding}
    >
      {children}
    </PageContainerPresenter>
  );
};

export default PageContainer;
