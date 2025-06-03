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

type PersonalInformationNavigationProp = StackNavigationProp<RootStackParamList>;

export interface PersonalInformationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
}

/**
 * PersonalInformation Screen Container
 * 
 * This component fetches complete user data including client information (companyName, siretNumber)
 * using usersService.getUserById() and allows users to update their personal and company information.
 * 
 * Features:
 * - Fetches complete user data with client information on mount
 * - Displays loading state while fetching data
 * - Allows editing of personal info (firstName, lastName, email, phoneNumber) 
 * - Allows editing of company info (companyName, siretNumber)
 * - Updates both user and client data via the extended UpdateUserDto
 * - Refreshes data after successful update
 * - Handles form validation and dirty state checking
 */
const PersonalInformation = () => {
  const navigation = useNavigation<PersonalInformationNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [userClient, setUserClient] = useState<UserWithClientDto | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch
  } = useForm<PersonalInformationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      siretNumber: "",
    },
    mode: 'onBlur',
  });

  // Watch all form values for debugging or real-time validation
  const watchedValues = watch();

  // Fetch complete user data with client information
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      setIsLoadingUserData(true);
      try {
        const userData = await usersService.getUserById(user.id);
        setUserClient(userData);
        
        // Update form with complete user data including client information
        const formData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          companyName: userData.client?.companyName || "",
          siretNumber: userData.client?.siretNumber || "",
        };
        
        // Set individual field values
        Object.entries(formData).forEach(([key, value]) => {
          setValue(key as keyof PersonalInformationFormData, value);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert(
          "Erreur",
          "Impossible de récupérer les données utilisateur"
        );
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user?.id, setValue]);

  // Initialize form with basic user data as fallback
  useEffect(() => {
    if (user && !userClient) {
      const formData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        companyName: (user as any).companyName || "",
        siretNumber: (user as any).siretNumber || "",
      };
      
      // Set individual field values
      Object.entries(formData).forEach(([key, value]) => {
        setValue(key as keyof PersonalInformationFormData, value);
      });
    }
  }, [user, userClient, setValue]);

  // Validation rules for react-hook-form
  const validationRules = {
    firstName: {
      required: "Le prénom est requis",
      minLength: {
        value: 2,
        message: "Le prénom doit contenir au moins 2 caractères"
      },
      maxLength: {
        value: 50,
        message: "Le prénom ne peut pas dépasser 50 caractères"
      },
      pattern: {
        value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
        message: "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"
      }
    },
    lastName: {
      required: "Le nom est requis",
      minLength: {
        value: 2,
        message: "Le nom doit contenir au moins 2 caractères"
      },
      maxLength: {
        value: 50,
        message: "Le nom ne peut pas dépasser 50 caractères"
      },
      pattern: {
        value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
        message: "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"
      }
    },
    email: {
      required: "L'email est requis",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Format d'email invalide"
      },
      maxLength: {
        value: 100,
        message: "L'email ne peut pas dépasser 100 caractères"
      }
    },
    phoneNumber: {
      pattern: {
        value: /^[\+]?[0-9\s\-\(\)\.]{10,15}$/,
        message: "Format de téléphone invalide (10-15 chiffres)"
      }
    },
    companyName: {
      required: "Le nom de l'entreprise est requis",
      minLength: {
        value: 2,
        message: "Le nom de l'entreprise doit contenir au moins 2 caractères"
      },
      maxLength: {
        value: 100,
        message: "Le nom de l'entreprise ne peut pas dépasser 100 caractères"
      }
    },
    siretNumber: {
      required: "Le numéro SIRET est requis",
      pattern: {
        value: /^[0-9]{14}$/,
        message: "Le numéro SIRET doit contenir exactement 14 chiffres"
      }
    }
  };

  const onSubmit = async (data: PersonalInformationFormData) => {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    try {
      const updateData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim() || undefined,
        companyName: data.companyName.trim(),
        siretNumber: data.siretNumber.trim(),
      };

      // Update user data via API
      const updatedUser = await usersService.updateUser(user.id, updateData);
      
      // Update user data in Redux store with the basic user fields
      dispatch(updateUser({
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
      }));

      // Refresh the complete user data with client information
      try {
        const refreshedUserData = await usersService.getUserById(user.id);
        setUserClient(refreshedUserData);
      } catch (refreshError) {
        console.warn("Could not refresh user data:", refreshError);
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
      console.error("Error updating user:", error);
      Alert.alert(
        "Erreur",
        error?.response?.data?.message || "Une erreur est survenue lors de la mise à jour"
      );
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
            // Use complete user data with client information if available
            const userData = userClient || user;
            if (userData) {
              reset({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                companyName: userClient?.client?.companyName || (userData as any).companyName || "",
                siretNumber: userClient?.client?.siretNumber || (userData as any).siretNumber || "",
              });
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
      isLoading={isSubmitting || isLoadingUserData}
      errors={errors}
      validationRules={validationRules}
      watchedValues={watchedValues}
      onBack={handleBack}
      onReset={handleReset}
      isDirty={isDirty}
    />
  );
};

export default PersonalInformation; 