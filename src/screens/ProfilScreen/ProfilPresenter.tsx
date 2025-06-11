import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import PageStyle from "src/components/Profil/PageStyle/PageStyle";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import ProfileLinks from "src/components/Profil/ProfileLinks/ProfileLinks";
import { isTablet } from "src/utils/deviceUtils";
import { User, UserWithClientDto } from "src/types/User";

interface ProfilPresenterProps {
  onNavigate?: (screen: string) => void;
  isAuthenticated: boolean;
  user: UserWithClientDto | null;
  deconnectionLoading?: boolean;
}

const ProfilPresenter: React.FC<ProfilPresenterProps> = ({ 
  onNavigate, 
  isAuthenticated, 
  user,
  deconnectionLoading = false,
}) => {
  const colors = useColors();

  return (
    <PageStyle 
      user={user}
      isAuthenticated={isAuthenticated}
      deconnectionLoading={deconnectionLoading}
    >
        <ProfileLinks 
          onNavigate={onNavigate} 
          isAuthenticated={isAuthenticated}
          userType={user?.type}
        />
    </PageStyle>
  );
};

export default ProfilPresenter;


