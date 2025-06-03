import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProfilPresenter from "./ProfilPresenter";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/navigation/types";
import { useAuth } from "src/hooks/useAuth";
import { isTablet } from "src/utils/deviceUtils";

type ProfilNavigationProp = StackNavigationProp<RootStackParamList>;

const Profil = () => {
  const navigation = useNavigation<ProfilNavigationProp>();
  const { logout, isAuthenticated, user } = useAuth();

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case "Login":
        navigation.navigate("Auth", { screen: "Login" });
        break;
      case "Register":
        navigation.navigate("Auth", { screen: "Register" });
        break;
      case "Quotes":
        console.log("Navigate to Quotes screen");
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
      default:
        console.log(`Navigate to: ${screen}`);
    }
  };


  return (
    <PageContainer>
      <ProfilPresenter
        onNavigate={handleNavigation}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </PageContainer>
  );
};

export default Profil;

const styles = StyleSheet.create({});
