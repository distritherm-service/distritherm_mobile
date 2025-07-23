import { StyleSheet, Platform , Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GoogleSignInPresenter from "./GoogleSignInPresenter";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
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
      // Optionnel - pas de required
      minLength: {
        value: 2,
        message: "Le nom doit contenir au moins 2 caractères",
      },
    },
    siretNumber: {
      // Optionnel - pas de required
      pattern: {
        value: /^\d{14}$/,
        message: "Le numéro SIRET doit contenir exactement 14 chiffres (si renseigné)",
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
      const userInfo = await GoogleSignin.signIn();
      
      // Vérifier explicitement que l'utilisateur s'est bien connecté
      if (!userInfo || !userInfo.data) {

        return; // Sortie silencieuse
      }

      // Get tokens pour double vérification
      const tokens = await GoogleSignin.getTokens();
      
      if (!tokens || !tokens.idToken) {
        return; // Sortie silencieuse
      }

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
      // 1. TOUTE erreur Google Sign-In = ANNULATION (sauf erreurs techniques)
      if (!error.response) {
        // Pas de réponse du backend = erreur côté Google Sign-In
        return; // Sortie silencieuse pour toutes les erreurs Google
      }

      // 2. Erreur 404 du backend = utilisateur connecté Google mais pas inscrit
      if (error.response?.status === 404) {
        setCompleteInformation(true);
        setTimeout(() => {
          reset();
          clearErrors();
        }, 200);
        return;
      }

      // 3. Autres erreurs backend
      let errorText = "Une erreur est survenue lors de la connexion avec Google.";

      if (error.response?.data?.message) {
        errorText = error.response.data.message;
      } else if (error.message) {
        errorText = error.message;
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
          // Envoyer companyName seulement s'il n'est pas vide
          companyName: formData.companyName.trim() || undefined,
          // Envoyer siretNumber seulement s'il n'est pas vide
          siretNumber: formData.siretNumber.trim() || undefined,
          // phoneNumber est toujours requis
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
