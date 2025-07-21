import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "src/navigation/types";
import { useAuth } from "src/hooks/useAuth";
import { updateUser } from "src/store/features/userState";
import { AppDispatch } from "src/store/store";
import usersService from "src/services/usersService";
import PersonalInformationPresenter from "./PersonalInformationPresenter";
import { UserWithClientDto } from "src/types/User";

type PersonalInformationNavigationProp =
  StackNavigationProp<RootStackParamList>;

export interface PersonalInformationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  siretNumber?: string;
}

const PersonalInformation = () => {
  const navigation = useNavigation<PersonalInformationNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [userWithClient, setUserWithClient] =
    useState<UserWithClientDto | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<PersonalInformationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      siretNumber: "",
    },
    mode: "onBlur",
  });

  /**
   * Converts UserWithClientDto to form data structure
   */
  const convertUserToFormData = (
    userData: UserWithClientDto
  ): PersonalInformationFormData => {
    return {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      companyName: userData.client?.companyName || "",
      siretNumber: userData.client?.siretNumber || "",
    };
  };

  /**
   * Creates fallback form data from basic user info when UserWithClientDto is not available
   */
  const createFallbackFormData = (): PersonalInformationFormData => {
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      companyName: "",
      siretNumber: "",
    };
  };

  // Fetch complete user data with client information using UserWithClientDto
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      setIsLoadingUserData(true);
      try {
        // getUserById should return UserWithClientDto according to the API
        const response: any = await usersService.getUserById(
          user.id
        );
        setUserWithClient(response.user);

        // Convert UserWithClientDto to form data structure
        const formData = convertUserToFormData(response.user);

        reset(formData);
      } catch (error) {
        console.error("❌ Error fetching UserWithClientDto:", error);

        // Fallback to basic user data if API call fails
        if (user) {
          const fallbackData = createFallbackFormData();
          reset(fallbackData);
        }

        Alert.alert(
          "Avertissement",
          "Impossible de récupérer toutes les données utilisateur. Certaines informations peuvent être manquantes."
        );
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user?.id, reset]);

  // Validation rules for react-hook-form
  const validationRules = {
    firstName: {
      required: "Le prénom est requis",
      minLength: {
        value: 2,
        message: "Le prénom doit contenir au moins 2 caractères",
      },
      maxLength: {
        value: 50,
        message: "Le prénom ne peut pas dépasser 50 caractères",
      },
      pattern: {
        value: /^[a-zA-ZÀ-ÿ\s'_'-]+$/,
        message:
          "Le prénom ne peut contenir que des lettres, espaces, apostrophes, tirets et underscores",
      },
    },
    lastName: {
      required: "Le nom est requis",
      minLength: {
        value: 2,
        message: "Le nom doit contenir au moins 2 caractères",
      },
      maxLength: {
        value: 50,
        message: "Le nom ne peut pas dépasser 50 caractères",
      },
      pattern: {
        value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
        message:
          "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets",
      },
    },
    email: {
      required: "L'email est requis",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Format d'email invalide",
      },
      maxLength: {
        value: 100,
        message: "L'email ne peut pas dépasser 100 caractères",
      },
    },
    phoneNumber: {
      required: "Le numéro de téléphone est requis",
      pattern: {
        value: /^[\+]?[0-9\s\-\(\)\.]{10,15}$/,
        message: "Format de téléphone invalide (10-15 chiffres)",
      },
    },
    companyName: {
      minLength: {
        value: 2,
        message: "Le nom de l'entreprise doit contenir au moins 2 caractères",
      },
      maxLength: {
        value: 100,
        message: "Le nom de l'entreprise ne peut pas dépasser 100 caractères",
      },
    },
    siretNumber: {
      pattern: {
        value: /^[0-9]{14}$/,
        message: "Le numéro SIRET doit contenir exactement 14 chiffres",
      },
    },
  };

  const onSubmit = async (data: PersonalInformationFormData) => {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    try {
      setIsSubmitting(true);
      // Prepare update data according to UpdateUserDto interface
      const updateData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim() || undefined,
        companyName: data.companyName?.trim() || undefined,
        siretNumber: data.siretNumber?.trim() || undefined,
      };

      // Update user data via API - this should update both user and client information
      await usersService.updateUser(user.id, updateData);

      // Update user data in Redux store with the basic user fields
      dispatch(
        updateUser({
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          phoneNumber: updateData.phoneNumber,
        })
      );

      // Refresh the complete UserWithClientDto data after successful update
      try {
        const response: any =
          await usersService.getUserById(user.id);
        setUserWithClient(response.user);
      } catch (refreshError) {
        console.warn("⚠️ Could not refresh UserWithClientDto:", refreshError);
      }

      Alert.alert(
        "Succès",
        "Vos informations ont été mises à jour avec succès",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ Error updating user:", error);
      Alert.alert(
        "Erreur",
        error?.response?.data?.message ||
          "Une erreur est survenue lors de la mise à jour"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        "Modifications non sauvegardées",
        "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Quitter",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Réinitialiser les modifications",
      "Voulez-vous annuler toutes les modifications et revenir aux valeurs d'origine ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            // Use UserWithClientDto data if available, otherwise fallback to basic user data
            if (userWithClient) {
              const formData = convertUserToFormData(userWithClient);
              reset(formData);
            } else if (user) {
              const fallbackData = createFallbackFormData();
              reset(fallbackData);
            }
          },
        },
      ]
    );
  };

  return (
    <PersonalInformationPresenter
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isLoadingUserData={isLoadingUserData}
      isSubmitting={isSubmitting}
      validationRules={validationRules}
      onBack={handleBack}
      onReset={handleReset}
      isDirty={isDirty}
    />
  );
};

export default PersonalInformation;
