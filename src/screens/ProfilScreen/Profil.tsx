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
import usersService from "src/services/usersService";

type ProfilNavigationProp = StackNavigationProp<RootStackParamList>;

const Profil = () => {
  const navigation = useNavigation<ProfilNavigationProp>();
  const { logout, isAuthenticated, user, deconnectionLoading } = useAuth();
  const dispatch = useDispatch();

  // Fonction de test pour forcer la récupération des données fraîches
  const refreshUserData = async () => {
    try {
      const response = await usersService.getCurrentUser();

      // Mettre à jour Redux
      dispatch(updateUser(response.user));
    } catch (error) {
      console.error("❌ Test refresh - Erreur:", error);
    }
  };

  // Auto-refresh au montage du composant pour diagnostic
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUserData();
    }
  }, [isAuthenticated]);

  // Handle user profile update - récupère les données fraîches via /me
  const handleUserUpdate = async (updatedUser: UserWithClientDto) => {
    try {
      // Récupérer les données utilisateur fraîches depuis l'API via /me
      const response = await usersService.getCurrentUser();

      // Extraire les données utilisateur de la réponse {user: {...}, message: "..."}
      const userData = response.user;

      // Mettre à jour Redux avec les données fraîches du serveur
      dispatch(updateUser(userData));
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des données utilisateur:",
        error
      );

      // Fallback: utiliser les données retournées par changePicture si /me échoue
      dispatch(updateUser(updatedUser));

      Alert.alert(
        "Avertissement",
        "Photo mise à jour avec succès, mais impossible de synchroniser certaines données."
      );
    }
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
      case "Reservations":
        navigation.navigate("MesReservations");
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
