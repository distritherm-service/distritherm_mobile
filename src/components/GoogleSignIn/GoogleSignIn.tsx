import { StyleSheet, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GoogleSignInPresenter from "./GoogleSignInPresenter";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

interface GoogleSignInProps {
  onSignInError?: (errorText: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSignInError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "592794634648-38n0hj2dhk0frc5tm2o7c3gol5d06clc.apps.googleusercontent.com",
      iosClientId: "592794634648-ljt0hu46l9i41aovkqq90m9lto4r4ohd.apps.googleusercontent.com",
      offlineAccess: true,
      hostedDomain: "",
      forceCodeForRefreshToken: true,
      accountName: "",
      profileImageSize: 120,
    });
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      // Get tokens
      const tokens = await GoogleSignin.getTokens();
      console.log("Google Tokens:", tokens);
      
      // Here you can handle the successful sign-in
      // For example, send the tokens to your backend
      
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let errorText = "Une erreur est survenue lors de la connexion avec Google.";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorText = "Vous avez annulé la connexion avec Google.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorText = "Une connexion est déjà en cours.";
      } else if (Platform.OS === 'android' && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorText = "Les services Google Play ne sont pas disponibles ou sont obsolètes.";
      } else if (error.message && error.message.includes("DEVELOPER_ERROR")) {
        errorText = "Erreur de configuration Google Sign-In. Veuillez vérifier la configuration dans Google Console.";
        console.error("DEVELOPER_ERROR Details:", {
          message: error.message,
          code: error.code,
          error: error,
          platform: Platform.OS
        });
      } else if (Platform.OS === 'ios') {
        // iOS specific error handling
        if (error.message && error.message.includes("The operation couldn't be completed")) {
          errorText = "Erreur de configuration iOS. Vérifiez que le schéma d'URL est correctement configuré.";
        } else if (error.message && error.message.includes("network")) {
          errorText = "Problème de connexion réseau. Veuillez réessayer.";
        }
      }

      if (onSignInError) {
        onSignInError(errorText);
      } else {
        Alert.alert("Erreur de connexion", errorText);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSignInError]);

  return <GoogleSignInPresenter isLoading={isLoading} handleGoogleSignIn={handleGoogleSignIn} />;
};

export default GoogleSignIn;

const styles = StyleSheet.create({});
