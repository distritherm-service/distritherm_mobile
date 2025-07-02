import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProfilPresenter from "./ProfilPresenter";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/navigation/types";
import { useAuth } from "src/hooks/useAuth";
import { isTablet } from "src/utils/deviceUtils";
import { useDispatch } from "react-redux";
import { updateUser } from "src/store/features/userState";
import { UserWithClientDto } from "src/types/User";

type ProfilNavigationProp = StackNavigationProp<RootStackParamList>;

const Profil = () => {
  const navigation = useNavigation<ProfilNavigationProp>();
  const { logout, isAuthenticated, user, deconnectionLoading } = useAuth();
  const dispatch = useDispatch();

  // Handle user profile update
  const handleUserUpdate = (updatedUser: UserWithClientDto) => {
    dispatch(updateUser(updatedUser));
  };

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case "Login":
        navigation.navigate("Auth", { screen: "Login" });
        break;
      case "Register":
        navigation.navigate("Auth", { screen: "Register" });
        break;
      case "Quotes":
        navigation.navigate("MesDevis");
        break;
      case "PersonalInfo":
        navigation.navigate("PersonalInformation");
        break;
      case "ChangePassword":
        navigation.navigate("ForgotPassword");
        break;
      case "Logout":
        Alert.alert(
          "Déconnexion",
          "Êtes-vous sûr de vouloir vous déconnecter ?",
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Déconnexion",
              style: "destructive",
              onPress: () => logout(),
            },
          ]
        );
        break;
    }
  };

  return (
    <PageContainer isScrollable={false}>
      <ProfilPresenter
        onNavigate={handleNavigation}
        isAuthenticated={isAuthenticated}
        user={user}
        deconnectionLoading={deconnectionLoading}
        onUserUpdate={handleUserUpdate}
      />
    </PageContainer>
  );
};

export default Profil;

const styles = StyleSheet.create({});
