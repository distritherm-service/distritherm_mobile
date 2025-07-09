import React, { useState } from "react";
import PageStylePresenter from "./PageStylePresenter";
import { ms } from "react-native-size-matters";
import { User, UserWithClientDto } from "src/types/User";
import { Alert, Platform, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import usersService from "src/services/usersService";

interface PageStyleProps {
  children?: React.ReactNode;
  user?: UserWithClientDto | null;
  isAuthenticated?: boolean;
  deconnectionLoading?: boolean;
  onUserUpdate?: (updatedUser: UserWithClientDto) => void;
}

const PageStyle: React.FC<PageStyleProps> = ({
  children,
  user,
  isAuthenticated,
  deconnectionLoading = false,
  onUserUpdate,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState<boolean>(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);

  // Check if user is authenticated and email is not verified
  const isEmailUnverified = !!(
    isAuthenticated &&
    user &&
    user.client &&
    !user.client.emailVerified
  );

  console.log(user?.urlPicture);

  const heightPercentage = isAuthenticated
    ? user?.client?.emailVerified
      ? Platform.OS == "ios"
        ? 0.26
        : 0.26
      : Platform.OS == "ios"
      ? 0.21
      : 0.21
    : Platform.OS == "ios"
    ? 0.61
    : 0.64;
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
    if (Platform.OS === "ios") {
      // iOS: Ouvre directement les paramètres de l'app
      Linking.openURL("app-settings:");
    } else {
      // Android: Ouvre les paramètres de l'application
      // Cette méthode ouvre les paramètres de l'app où l'utilisateur peut gérer les permissions
      Linking.openSettings();
    }
  };

  const onOpenModalImagePicker = () => {
    setIsModalVisible(true);
  };

  const onCloseModaImagePicker = () => {
    setIsModalVisible(false);
  };

  const onPhoto = async () => {
    setIsModalVisible(false);

    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Autorisation Caméra Requise",
          Platform.OS === "ios"
            ? "Pour prendre des photos, activez l'accès à la caméra dans les paramètres de l'app."
            : "Pour prendre des photos, activez l'autorisation Caméra dans les paramètres de l'application.",
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Ouvrir les paramètres",
              onPress: openAppPermissions,
            },
          ]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        
        // Auto-upload the taken photo
        if (user?.id) {
          await uploadPicture(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la prise de photo."
      );
    }
  };

  const onGallery = async () => {
    setIsModalVisible(false);

    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Autorisation Photos Requise",
          Platform.OS === "ios"
            ? "Pour sélectionner des photos, activez l'accès aux photos dans les paramètres de l'app."
            : "Pour sélectionner des photos, activez l'autorisation Stockage/Photos dans les paramètres de l'application.",
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Ouvrir les paramètres",
              onPress: openAppPermissions,
            },
          ]
        );
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        
        // Auto-upload the selected image
        if (user?.id) {
          await uploadPicture(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection de l'image."
      );
    }
  };

  // Function to upload picture to backend
  const uploadPicture = async (imageUri: string) => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non identifié");
      return;
    }

    try {
      setIsUploadingPicture(true);
      
      const updatedUser = await usersService.changePicture(user.id, imageUri);
      
      // Update user data in parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      Alert.alert(
        "Succès",
        "Votre photo de profil a été mise à jour avec succès !",
        [{ text: "OK" }]
      );
      
      // Clear selected image after successful upload
      setSelectedImage(null);
      
    } catch (error: any) {
      console.error("Error uploading picture:", error);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || 
        "Impossible de mettre à jour votre photo de profil. Veuillez réessayer."
      );
    } finally {
      setIsUploadingPicture(false);
    }
  };

  // Function to resend verification email
  const handleResendVerificationEmail = async () => {
    if (!user?.email) {
      Alert.alert("Erreur", "Adresse email non trouvée");
      return;
    }

    try {
      setIsResendingEmail(true);
      await usersService.resendVerificationEmail({ email: user.email });

      Alert.alert(
        "Email envoyé",
        "Un nouvel email de vérification a été envoyé à votre adresse email.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.response?.data?.message ||
          "Impossible d'envoyer l'email de vérification"
      );
    } finally {
      setIsResendingEmail(false);
    }
  };

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
      deconnectionLoading={deconnectionLoading}
      isEmailUnverified={isEmailUnverified}
      onResendVerificationEmail={handleResendVerificationEmail}
      isResendingEmail={isResendingEmail}
      isUploadingPicture={isUploadingPicture}
    >
      {children}
    </PageStylePresenter>
  );
};

export default PageStyle;
