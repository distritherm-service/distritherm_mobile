import React, { useState } from "react";
import PageStylePresenter from "./PageStylePresenter";
import { ms } from "react-native-size-matters";
import { User } from "src/types/User";
import { Alert, Platform, Linking } from "react-native";
import * as ImagePicker from 'expo-image-picker';

interface PageStyleProps {
  children?: React.ReactNode;
  user?: User | null;
  isAuthenticated?: boolean;
}

const PageStyle: React.FC<PageStyleProps> = ({
  children,
  user,
  isAuthenticated,
}) => {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const heightPercentage = isAuthenticated
    ? Platform.OS == "ios"
      ? 0.20
      : 0.20
    : Platform.OS == "ios"
    ? 0.57
    : 0.61;
  const imageHeight = isAuthenticated
    ? ms(80)
    : Platform.OS == "android"
    ? ms(255)
    : ms(220);
  const imageWidth = isAuthenticated
    ? ms(80)
    : Platform.OS == "android"
    ? ms(255)
    : ms(220);

  const logoSize = {
    width: imageWidth || ms(100),
    height: imageHeight || ms(100),
  };

  // Function to open app-specific permissions settings
  const openAppPermissions = () => {
    if (Platform.OS === 'ios') {
      // iOS: Ouvre directement les paramètres de l'app
      Linking.openURL('app-settings:');
    } else {
      // Android: Ouvre les paramètres de l'application
      // Cette méthode ouvre les paramètres de l'app où l'utilisateur peut gérer les permissions
      Linking.openSettings();
    }
  };

  const onOpenModalImagePicker = () => {
    setIsModalVisible(true);
  }

  const onCloseModaImagePicker = () => {
    setIsModalVisible(false);
  }

  const onPhoto = async () => {
    setIsModalVisible(false);
    
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Autorisation Caméra Requise',
          Platform.OS === 'ios' 
            ? 'Pour prendre des photos, activez l\'accès à la caméra dans les paramètres de l\'app.'
            : 'Pour prendre des photos, activez l\'autorisation Caméra dans les paramètres de l\'application.',
          [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Ouvrir les paramètres',
              onPress: openAppPermissions,
            },
          ]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        console.log('Photo taken:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de photo.');
    }
  }

  const onGallery = async () => {
    setIsModalVisible(false);
    
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Autorisation Photos Requise',
          Platform.OS === 'ios' 
            ? 'Pour sélectionner des photos, activez l\'accès aux photos dans les paramètres de l\'app.'
            : 'Pour sélectionner des photos, activez l\'autorisation Stockage/Photos dans les paramètres de l\'application.',
          [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Ouvrir les paramètres',
              onPress: openAppPermissions,
            },
          ]
        );
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  }

  return (
    <PageStylePresenter
      user={isAuthenticated && user ? user : undefined}
      heightPercentage={heightPercentage}
      logoSize={logoSize}
      onOpenModalImagePicker={onOpenModalImagePicker}
      onCloseModaImagePicker={onCloseModaImagePicker}
      isModalVisible={isModalVisible}
      onPhoto={onPhoto}
      onGallery={onGallery}
      selectedImage={selectedImage}
    >
      {children}
    </PageStylePresenter>
  );
};

export default PageStyle;
