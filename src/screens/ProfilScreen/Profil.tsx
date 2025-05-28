import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProfilPresenter from "./ProfilPresenter";

const Profil = () => {
  const handleNavigation = (screen: string) => {
    // Ici vous pouvez ajouter votre logique de navigation
    // Par exemple avec React Navigation:
    // navigation.navigate(screen);
    
    switch (screen) {
      case 'Login':
        console.log('Navigate to Login screen');
        break;
      case 'Register':
        console.log('Navigate to Register screen');
        break;
      case 'Orders':
        console.log('Navigate to Orders screen');
        break;
      case 'Quotes':
        console.log('Navigate to Quotes screen');
        break;
      case 'PersonalInfo':
        console.log('Navigate to Personal Info screen');
        break;
      case 'ChangePassword':
        console.log('Navigate to Change Password screen');
        break;
      case 'Logout':
        console.log('Logout user');
        break;
      default:
        console.log(`Navigate to: ${screen}`);
    }
  };

  return (
    <PageContainer>
      <ProfilPresenter onNavigate={handleNavigation} />
    </PageContainer>
  );
};

export default Profil;

const styles = StyleSheet.create({});
