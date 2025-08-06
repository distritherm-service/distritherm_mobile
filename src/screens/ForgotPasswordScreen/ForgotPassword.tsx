import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "src/navigation/types";
import usersService from "src/services/usersService";
import ForgotPasswordPresenter from "./ForgotPasswordPresenter";

type ForgotPasswordNavigationProp = StackNavigationProp<RootStackParamList>;

// Form interface for password change
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Validation rules
export const changePasswordValidationRules = {
  currentPassword: {
    required: "Le mot de passe actuel est requis",
  },
  newPassword: {
    required: "Le nouveau mot de passe est requis",
    minLength: {
      value: 8,
      message: "Le mot de passe doit contenir au moins 8 caractères",
    },
  },
  confirmPassword: {
    required: "La confirmation du mot de passe est requise",
  },
};

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  
  const [isLoading, setIsLoading] = useState(false);

  // Form for password change
  const { control, handleSubmit, watch, formState: { isDirty } } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Custom validation for password confirmation
  const validatePasswordMatch = (value: string) => {
    const newPassword = watch("newPassword");
    return value === newPassword || "Les mots de passe ne correspondent pas";
  };

  // Custom validation to ensure new password is different from current
  const validateNewPasswordDifferent = (value: string) => {
    const currentPassword = watch("currentPassword");
    if (currentPassword && value === currentPassword) {
      return "Le nouveau mot de passe doit être différent du mot de passe actuel";
    }
    return true;
  };

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await usersService.updatePassword({
        currentPassword: data.currentPassword.trim(),
        newPassword: data.newPassword.trim(),
      });
      
      Alert.alert(
        "Succès",
        "Votre mot de passe a été modifié avec succès.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Erreur",
        error?.response?.data?.message || "Une erreur est survenue lors de la modification du mot de passe"
      );
    } finally {
      setIsLoading(false);
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

  return (
    <ForgotPasswordPresenter
      control={control}
      isLoading={isLoading}
      onChangePassword={handleSubmit(handleChangePassword)}
      onBack={handleBack}
      validationRules={changePasswordValidationRules}
      validatePasswordMatch={validatePasswordMatch}
      validateNewPasswordDifferent={validateNewPasswordDifferent}
    />
  );
};

export default ForgotPassword; 