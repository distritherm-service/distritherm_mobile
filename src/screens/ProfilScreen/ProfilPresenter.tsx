import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import PageStyle from "src/components/Profil/PageStyle/PageStyle";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { ms } from "react-native-size-matters";
import { colors } from "src/utils/colors";
import ProfileLinks from "src/components/Profil/ProfileLinks/ProfileLinks";
import { isTablet } from "src/utils/deviceUtils";
import { User } from "src/types/User";

interface ProfilPresenterProps {
  onNavigate?: (screen: string) => void;
  isAuthenticated: boolean;
  user: User | null;
}

const ProfilPresenter: React.FC<ProfilPresenterProps> = ({ 
  onNavigate, 
  isAuthenticated, 
  user,
}) => {
  return (
    <PageStyle 
      user={user}
      isAuthenticated={isAuthenticated}
    >
        <ProfileLinks 
          onNavigate={onNavigate} 
          isAuthenticated={isAuthenticated}
        />
    </PageStyle>
  );
};

export default ProfilPresenter;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  profilInfo: {
    alignItems: "center",
    position: "absolute",
    top: ms(-80),
    width: "100%",
    alignSelf: "center",
    zIndex: 60,
  },
  profilImage: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(30),
    marginBottom: ms(15),
    zIndex: 70,
  },
  profilName: {
    fontSize: ms(24),
    fontWeight: "bold",
    marginBottom: ms(8),
    color: colors.tertiary[900],
  },
  profilRole: {
    fontSize: ms(16),
    color: colors.tertiary[600],
  },
});
