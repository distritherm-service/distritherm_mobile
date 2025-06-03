import React, { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import usersService from "../../services/usersService";
import ForgotPasswordModalPresenter from "./ForgotPasswordModalPresenter";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await usersService.sendPasswordResetEmail({ email: data.email });
    } catch (error: any) {
      return null;
    } finally {
      Alert.alert(
        "Email envoyé",
        "Si votre compte existe, un email de réinitialisation de mot de passe vous a été envoyé.",
        [
          {
            text: "OK",
            onPress: () => {
              reset();
              onClose();
            },
          },
        ]
      );
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <ForgotPasswordModalPresenter
      visible={visible}
      onClose={handleClose}
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    />
  );
};

export default ForgotPasswordModal;
