import React from 'react';
import PageStylePresenter from './PageStylePresenter';
import { ms } from 'react-native-size-matters';
import { User } from 'src/types/User';

interface PageStyleProps {
  children?: React.ReactNode;
  user?: User;
  heightPercentage?: number;
  imageHeight?: number;
  imageWidth?: number;
}

const PageStyle: React.FC<PageStyleProps> = ({ 
  children, 
  user, 
  heightPercentage = 0.25,
  imageHeight,
  imageWidth
}) => {
  const logoSize = {
    width: imageWidth || ms(100),
    height: imageHeight || ms(100)
  };
  
  return (
    <PageStylePresenter 
      user={user} 
      heightPercentage={heightPercentage}
      logoSize={logoSize}
    >
      {children}
    </PageStylePresenter>
  );
};

export default PageStyle;