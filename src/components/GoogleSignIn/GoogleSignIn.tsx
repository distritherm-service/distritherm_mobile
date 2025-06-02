import { StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GoogleSignInPresenter from "./GoogleSignInPresenter";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

interface GoogleSignInProps {
  onSignInSuccess?: (userInfo: any) => void;
  onSignInError?: (errorText: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSignInSuccess,
  onSignInError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "592794634648-cq50d6pb3llivmbc6bt5a1jee0ashd86.apps.googleusercontent.com", // From your google-services.json
      offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: "", // Restrict to a domain if needed
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId: "592794634648-your-ios-client-id.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info.plist, new name here, e.g. GoogleService-Info-Staging.plist
      profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();
      console.log("Google Tokens:", tokens);

      console;
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let errorText = "Une erreur est survenue lors de la connexion avec Google.";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorText = "Vous avez annulé la connexion avec Google.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorText = "Une connexion est déjà en cours.";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorText = "Les services Google Play ne sont pas disponibles ou sont obsolètes.";
      }

      if (onSignInError) {
        onSignInError(errorText);
      } else {
        Alert.alert("Erreur de connexion", errorText);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSignInSuccess, onSignInError]);

  return <GoogleSignInPresenter />;
};

export default GoogleSignIn;

const styles = StyleSheet.create({});
