import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";
import ProfilPresenter from "./ProfilPresenter";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/navigation/types";

type ProfilNavigationProp = StackNavigationProp<RootStackParamList>;

const Profil = () => {

  const navigation = useNavigation<ProfilNavigationProp>();

  const handleNavigation = (screen: string) => {
    
    switch (screen) {
      case 'Login':
        navigation.navigate('Auth', { screen: 'Login' });
        break;
      case 'Register':
        navigation.navigate('Auth', { screen: 'Register' });
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
