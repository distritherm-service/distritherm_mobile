import { StyleSheet, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GoogleSignInPresenter from "./GoogleSignInPresenter";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import authService, { AdditionalUserInfoDto } from "src/services/authService";
import { useForm, Control, FieldErrors } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/types';

type GoogleSignInNavigationProp = StackNavigationProp<RootStackParamList>;

interface GoogleSignInProps {
  onSignInError: (errorText: string) => void;
}

interface FormData {
  companyName: string;
  siretNumber: string;
  phoneNumber: string;
}

// Custom hook for form management with submit-only validation
const useFormValidation = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      companyName: "",
      siretNumber: "",
      phoneNumber: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const formRules = {
    companyName: {
      required: "Le nom de l'entreprise est requis",
      minLength: {
        value: 2,
        message: "Le nom doit contenir au moins 2 caractères",
      },
    },
    siretNumber: {
      required: "Le numéro SIRET est requis",
      pattern: {
        value: /^\d{14}$/,
        message: "Le numéro SIRET doit contenir exactement 14 chiffres",
      },
    },
    phoneNumber: {
      required: "Le numéro de téléphone est requis",
      pattern: {
        value: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
        message: "Format de téléphone invalide (ex: 06 12 34 56 78)",
      },
    },
  };

  return {
    control,
    handleSubmit,
    errors,
    reset,
    clearErrors,
    formRules,
  };
};

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSignInError }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completeInformation, setCompleteInformation] =
    useState<boolean>(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const { login } = useAuth();
  const navigation = useNavigation<GoogleSignInNavigationProp>();

  // Form management
  const { control, handleSubmit, errors, reset, clearErrors, formRules } =
    useFormValidation();

  useEffect(() => {
    // Configuration Google Sign-In avec variables d'environnement
    const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
    const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

    // Validation des variables d'environnement
    if (
      !process.env.EXPO_PUBLIC_WEB_CLIENT_ID ||
      !process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    ) {
      console.warn(
        "⚠️  Variables d'environnement manquantes pour Google Sign-In.\n" +
          "📝 Vérifiez que EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID et EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID sont dans votre fichier .env"
      );
    }

    GoogleSignin.configure({
      webClientId: webClientId,
      iosClientId: iosClientId,
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
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      // Sign in with Google
      await GoogleSignin.signIn();

      // Get tokens
      const tokens = await GoogleSignin.getTokens();

      setIdToken(tokens.idToken);

      const response = await authService.providerLogin({
        providerAuthToken: tokens.idToken,
        providerName: "GOOGLE",
      });

      await login(response.user, response.accessToken, response.refreshToken);

      // Petit délai pour s'assurer que l'état est bien synchronisé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirection vers la page Profil après connexion Google réussie
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: { initialTab: "Profil" },
          },
        ],
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCompleteInformation(true);
        setTimeout(() => {
          reset();
          clearErrors(); // Clear any previous validation errors
        }, 200);
        return;
      }

      let errorText =
        "Une erreur est survenue lors de la connexion avec Google.";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorText = "Vous avez annulé la connexion avec Google.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorText = "Une connexion est déjà en cours.";
      } else if (
        Platform.OS === "android" &&
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        errorText =
          "Les services Google Play ne sont pas disponibles ou sont obsolètes.";
      } else if (error.message && error.message.includes("DEVELOPER_ERROR")) {
        errorText =
          "Erreur de configuration Google Sign-In. Veuillez vérifier la configuration dans Google Console.";
      } else if (Platform.OS === "ios") {
        // iOS specific error handling
        if (
          error.message &&
          error.message.includes("The operation couldn't be completed")
        ) {
          errorText =
            "Erreur de configuration iOS. Vérifiez que le schéma d'URL est correctement configuré.";
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
  }, [onSignInError, reset, clearErrors, navigation]);

  const handleRegisterAuthGoogle = useCallback(
    async (formData: FormData) => {
      try {
        setIsLoading(true);

        if (!idToken) {
          throw new Error(
            "Échec de l'authentification avec Google - jeton d'identification manquant"
          );
        }

        const additionalInfo: AdditionalUserInfoDto = {
          companyName: formData.companyName,
          siretNumber: formData.siretNumber,
          phoneNumber: formData.phoneNumber,
        };

        const response = await authService.providerRegister({
          providerAuthToken: idToken,
          providerName: "GOOGLE",
          additionalInfo,
        });

        await login(response.user, response.accessToken, response.refreshToken);

        // Petit délai pour s'assurer que l'état est bien synchronisé
        await new Promise(resolve => setTimeout(resolve, 100));

        // Close modal and reset form on success
        setCompleteInformation(false);
        reset();
        clearErrors();

        // Redirection vers la page Profil après inscription Google réussie
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Main",
              params: { initialTab: "Profil" },
            },
          ],
        });
      } catch (error: any) {
        let errorMessage = "Échec de l'authentification avec Google";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        onSignInError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [idToken, onSignInError, reset, clearErrors, navigation]
  );

  const handleModalClose = useCallback(() => {
    setCompleteInformation(false);
    reset();
    clearErrors(); // Clear validation errors when closing modal
  }, [reset, clearErrors]);

  return (
    <GoogleSignInPresenter
      isLoading={isLoading}
      handleGoogleSignIn={handleGoogleSignIn}
      completeInformation={completeInformation}
      setCompleteInformation={setCompleteInformation}
      control={control}
      errors={errors}
      formRules={formRules}
      onSubmit={handleSubmit(handleRegisterAuthGoogle)}
      onModalClose={handleModalClose}
    />
  );
};

export default GoogleSignIn;

const styles = StyleSheet.create({});
